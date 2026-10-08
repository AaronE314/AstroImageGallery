import styles from "../styles/PhotoViewer.module.css";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
    fileName: string;
}

const VideoPlayer = ({ fileName }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        // pick web-optimized variant if available (<name>-web.mp4)
        const base = fileName.replace(/\.[^.]+$/, "");
        const webPath = `./images/${base}-web.mp4`;
        const origPath = `./images/${fileName}`;

        const chooseSource = async () => {
            try {
                const resp = await fetch(webPath, { method: "HEAD" });
                if (resp.ok) setSrc(webPath);
                else setSrc(origPath);
            } catch (e) {
                setSrc(origPath);
            }
        };

        chooseSource().then(() => {
            // Ensure the <source> is loaded so Chrome can detect MIME and start playback.
            try {
                v.load();
            } catch (e) {
                // ignore
            }

            // Try to autoplay; if blocked, user can use native controls.
            v.currentTime = 0;
            const tryPlay = async () => {
                try {
                    await v.play();
                } catch (e) {
                    // autoplay blocked — do nothing, native controls available
                }
            };

            tryPlay();
        });

        return () => {
            try {
                v.pause();
            } catch { }
        };
    }, [fileName]);

    return (
        <div className={styles.videoWrapper} onClick={(e) => e.stopPropagation()}>
            <video
                ref={videoRef}
                controls
                preload="auto"
                playsInline
                style={{ maxWidth: "100%", maxHeight: "80vh" }}
            >
                {src ? <source src={src} type="video/mp4" /> : null}
            </video>
        </div>
    );
};

export default VideoPlayer;