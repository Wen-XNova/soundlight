import { File, Paths } from 'expo-file-system';
import { FFmpegKit, ReturnCode } from '@mtd1410/react-native-ffmpegkit';


function locateDataChunk(bytes: Uint8Array): { bitsPerSample: number; dataOffset: number; dataSize: number } | null {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const bitsPerSample = view.getUint16(34, true);

    let offset = 36;
    while (offset < view.byteLength - 8) {
        const chunkId = String.fromCharCode(
            view.getUint8(offset), view.getUint8(offset + 1),
            view.getUint8(offset + 2), view.getUint8(offset + 3)
        );
        const chunkSize = view.getUint32(offset + 4, true);

        if (chunkId === 'data') {
            return { bitsPerSample, dataOffset: offset + 8, dataSize: chunkSize };
        }
        offset += 8 + chunkSize + (chunkSize % 2); 
    }
    return null;
}

function readPeaksInChunks(wavFile: File, targetPeaks: number): number[] {
    const handle = wavFile.open();

    try {
        const HEADER_PEEK_SIZE = 16 * 1024;
        const headerBytes = handle.readBytes(Math.min(HEADER_PEEK_SIZE, handle.size ?? HEADER_PEEK_SIZE));
        const chunkInfo = locateDataChunk(headerBytes);
        if (!chunkInfo) return new Array(targetPeaks).fill(0.1);

        const { bitsPerSample, dataOffset, dataSize } = chunkInfo;
        const bytesPerSample = bitsPerSample / 8;
        const totalSamples = Math.floor(dataSize / bytesPerSample);
        if (totalSamples <= 0) return new Array(targetPeaks).fill(0.1);

        const samplesPerBlock = Math.max(1, Math.floor(totalSamples / targetPeaks));

        let carryOver = headerBytes.subarray(Math.min(dataOffset, headerBytes.length));

        const peaks: number[] = [];
        let maxRms = 0;
        let samplesProcessed = 0;

        for (let i = 0; i < targetPeaks; i++) {
            const isLastBlock = i === targetPeaks - 1;
            const samplesRemaining = totalSamples - samplesProcessed;
            const samplesThisBlock = isLastBlock ? samplesRemaining : Math.min(samplesPerBlock, samplesRemaining);
            const bytesNeeded = samplesThisBlock * bytesPerSample;

            if (samplesThisBlock <= 0) {
                peaks.push(0);
                continue;
            }

            let block: Uint8Array;
            if (carryOver.length >= bytesNeeded) {
                block = carryOver.subarray(0, bytesNeeded);
                carryOver = carryOver.subarray(bytesNeeded);
            } else {
                const fresh = handle.readBytes(bytesNeeded - carryOver.length);
                block = new Uint8Array(bytesNeeded);
                block.set(carryOver, 0);
                block.set(fresh, carryOver.length);
                carryOver = new Uint8Array(0);
            }

            const blockView = new DataView(block.buffer, block.byteOffset, block.byteLength);
            let sumSquares = 0;
            const sampleCount = Math.floor(block.length / bytesPerSample);
            for (let j = 0; j < sampleCount; j++) {
                const off = j * bytesPerSample;
                const value = bitsPerSample === 16
                    ? blockView.getInt16(off, true) / 32768
                    : (blockView.getUint8(off) - 128) / 128;
                sumSquares += value * value;
            }

            const rms = Math.sqrt(sumSquares / (sampleCount || 1));
            peaks.push(rms);
            if (rms > maxRms) maxRms = rms;
            samplesProcessed += samplesThisBlock;
        }

        return peaks.map((p) => Math.max(0.05, maxRms > 0 ? p / maxRms : 0.05));
    } finally {
        handle.close();
    }
}
function parseDurationFromFfmpegOutput(output: string): number {
    const match = output.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
    if (!match) return 0;
    const [, hh, mm, ss, cs] = match;
    return (Number(hh) * 3600 + Number(mm) * 60 + Number(ss)) * 1000 + Number(cs) * 10;
}

export async function extractAudioPeaks(fileUri: string, targetPeaks: number = 100) {
    const tempWavFile = new File(Paths.cache, `temp_peaks_${Date.now()}.wav`);
    const tempWavPath = tempWavFile.uri;

    try {
        function toFsPath(uri: string): string {
            return uri.startsWith('file://') ? uri.slice('file://'.length) : uri;
        }

        const ffmpegCommand = `-y -i "${toFsPath(fileUri)}" -ac 1 -ar 2000 -acodec pcm_s16le -f wav "${toFsPath(tempWavPath)}"`;
        const session = await FFmpegKit.execute(ffmpegCommand);
        const returnCode = await session.getReturnCode();

        if (!ReturnCode.isSuccess(returnCode)) {
            throw new Error(`Processing failed with code ${returnCode}`);
        }

        const durationMs = parseDurationFromFfmpegOutput(await session.getOutput());
        const peaks = readPeaksInChunks(tempWavFile, targetPeaks);
        tempWavFile.delete();
        return { peaks, durationMs };
    } catch (error) {
        console.error('Audio extraction failed:', error);
        if (tempWavFile.exists) tempWavFile.delete();
        return { peaks: new Array(targetPeaks).fill(0.05), durationMs: 0 };
    }
}