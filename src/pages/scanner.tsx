import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';

import { BarcodeReader, CodeDetection, Configuration, StrichSDK } from "@pixelverse/strichjs-sdk";

import styles from '../styles/scanner.module.css';

/**
 * Create BarcodeReader configuration
 *
 * @param hostElem The host element hosting the BarcodeReader
 */
function createBarcodeReaderConfig(hostElem: HTMLElement): Configuration {
    return {
        selector: hostElem,
        engine: {
            symbologies: ['ean13', 'ean8', 'upca', 'upce', 'qr'],
            duplicateInterval: 2500,
            numScanlines: 20,
            minScanlinesNeeded: 3
        },
        locator: {
            // narrow region of interest for 1D codes
            regionOfInterest: {
                left: 0.05, right: 0.05,
                top: 0.4, bottom: 0.4
            }
        },
        frameSource: {
            resolution: 'full-hd'
        },
        feedback: {
            audio: true,
            vibration: true
        }
    };
}

function ScannerHeader() {
    return (
        <section className={styles.scannerHeader}>
            <h1>SCANNER</h1>
        </section>
    );
}

function ScannerActions() {
    const router = useRouter();
    return (
        <section className={styles.scannerActions}>
            <button onClick={() => router.push('/')}>FINISH SCANNING</button>
        </section>
    );
}

// @ts-ignore
function ScannerHost({addDetection}: {addDetection: (CodeDetection) => void}) {

    // a reference to the BarcodeReader host element
    const hostElemRef = useRef<HTMLDivElement | null>(null);

    // the SDK initialization state
    const [sdkState, setSdkState] = useState(StrichSDK.isInitialized() ? 'initialized' : undefined);

    // a reference to a BarcodeReader
    const barcodeReaderRef = useRef<BarcodeReader | null>(null);

    // this effect has no dependencies, so it should run only once (except if React StrictMode is on)
    useEffect(() => {
        const initializeSDK = async () => {
            if (StrichSDK.isInitialized()) {
                setSdkState('initialized');
            } else {
                try {
                    await StrichSDK.initialize('<your license key>');
                    console.log(`STRICH SDK initialized successfully`);
                    setSdkState('initialized');
                } catch (e) {
                    console.error(`Failed to initialize STRICH SDK: ${e}`);
                    setSdkState('initialization-error');
                }
            }
        };

        // run async initialization
        if (sdkState === undefined) {
            setSdkState('initializing');
            initializeSDK();
        }
    }, []);

    // BarcodeReader creation, once SDK is initialized
    useEffect(() => {
        if (sdkState === 'initialized' && barcodeReaderRef.current === null) {
            const barcodeReaderInitialization = async () => {

                console.log(`Initializing BarcodeReader...`);

                // @ts-ignore
                const barcodeReader = new BarcodeReader(createBarcodeReaderConfig(hostElemRef.current));
                barcodeReaderRef.current = barcodeReader;
                await barcodeReader.initialize();

                // when a barcode is detected, propagate it up the component tree
                barcodeReader.detected = ((detections) => {
                    detections.map(d => addDetection(d));
                });
                await barcodeReader.start();
            };
            barcodeReaderInitialization();

            // destroy the BarcodeReader in the cleanup function
            return () => {
                if (barcodeReaderRef.current !== null) {
                    console.log(`Destroying BarcodeReader`);
                    barcodeReaderRef.current.destroy();
                    barcodeReaderRef.current = null;
                }
            };
        }
    }, [sdkState]);

    // the component acts as the STRICH BarcodeReader host element
    return (
        <div className={styles.barcodeReader} ref={hostElemRef}/>
    );
}

/**
 * Component for displaying code detections.
 */
function ScannerResults({detections}: { detections: CodeDetection[] }) {
    return (
        <div className={styles.scannerResults}>
            {detections.map((detection) => (
                <span key={detection.time}>{detection.data}</span>
            ))}
        </div>
    )
}

/**
 * Parent component hosting the scanner, results and a button bar for actions.
 */
export function Scanner() {
    const [detections, setDetections] = useState([] as CodeDetection[]);
    const addDetection = useCallback((detection: CodeDetection) => {
        // add detection to list
        setDetections((prevDetections) => [...prevDetections, detection])
    }, [setDetections]);
    return (
        <main className={styles.scannerWrapper}>
            <ScannerHeader/>
            <ScannerHost addDetection={addDetection}/>
            <ScannerResults detections={detections}/>
            <ScannerActions/>
        </main>
    );
}

export default Scanner
