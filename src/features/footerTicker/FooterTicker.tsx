import { useState, useEffect, useRef } from "react";
import { useCity } from "../../app/CityProvider";
import { useVerticalScroll } from "../../hooks/useVerticalScroll";

import AllahImg from "../../assets/ressources/ALLAH-image.png";
import MuhammadImg from "../../assets/ressources/Muhammad-image.png";
import DuaImg from "../../assets/ressources/dua-image.png";

function imgFor(key?: string) {
    switch (key) {
        case "allah": return AllahImg;
        case "muhammad": return MuhammadImg;
        case "dua": return DuaImg;
        default: return null;
    }
}

export function FooterTicker() {
    const { dailyContent } = useCity();
    const items = dailyContent?.items ?? [];
    const itemsLen = items.length;

    const [index, setIndex] = useState(0);

    // ► Index normalisieren, wenn Items neu kommen / Länge sich ändert
    useEffect(() => {
        if (!itemsLen) { setIndex(0); return; }
        if (index >= itemsLen) setIndex(0);
    }, [itemsLen]); // eslint-disable-line react-hooks/exhaustive-deps

    // ► Rotation stabil (ein Intervall)
    useEffect(() => {
        if (!itemsLen) return;
        const id = setInterval(() => {
            setIndex(prev => (prev + 1) % itemsLen);
        }, 20000);
        return () => clearInterval(id);
    }, [itemsLen]);

    // ► Aktives Item
    const activeItem = itemsLen ? items[index % itemsLen] : null;

    // ► Scroll-Refs + Reset beim Itemwechsel
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    useVerticalScroll(containerRef, contentRef);

    useEffect(() => {
        // Auf Anfang springen, wenn Item wechselt
        const el = containerRef.current;
        if (el) el.scrollTop = 0;
    }, [index]);

    return (
        <footer
            className="
        glass-card glass-card-content glass-animate-in
        w-full flex items-center justify-start text-white
        mx-auto rounded-3xl h-[250px] px-4
      "
            style={{
                boxShadow:
                    "0 30px 60px rgba(0,0,0,0.9), 0 10px 24px rgba(0,0,0,0.8), 0 0 40px rgba(0,150,255,0.28)",
            }}
        >
            {!activeItem ? (
                <div
                    className="text-white font-light flex items-center"
                    style={{ fontSize: "3.2rem", lineHeight: 1.2, paddingLeft: "2rem" }}
                >
                    Lade islamische Inhalte…
                </div>
            ) : (
                <>
                    {/* LINKER BLOCK: Bild */}
                    <div
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{ marginLeft: "0.5rem", marginRight: "2rem", height: "18rem", width: "18rem" , borderColor: "#FFFFFF" }}
                    >
                        {(() => {
                            const src = imgFor(activeItem.imageKey);
                            if (src) {
                                return (
                                    <img
                                        src={src}
                                        alt={activeItem.title}
                                        width={288} height={288}
                                        style={{ height: "80%", width: "80%", objectFit: "contain" }}
                                    />
                                );
                            }
                            return (
                                <div
                                    className="text-[#009972] font-bold text-center"
                                    style={{ fontSize: "3.6rem", lineHeight: 1.1 }}
                                >
                                    {activeItem.title}
                                </div>
                            );
                        })()}
                    </div>

                    {/* RECHTER BLOCK: vertikaler Scroll */}
                    <div
                        ref={containerRef}
                        className="flex-grow overflow-hidden flex justify-center items-center"
                        style={{ height: "12rem" }}
                    >
                        <div
                            ref={contentRef}
                            className="flex flex-col w-full text-white"
                            style={{ rowGap: "2rem", maxWidth: "100%" }}
                            // key erzwingt Neuaufbau des Inhalts → sauberer Scroll-Reset
                            key={index}
                        >
                            <div
                                className="text-white text-center mt-10"
                                style={{ fontSize: "4rem", lineHeight: 1.25 }}
                            >
                                {activeItem.text}
                            </div>

                            {activeItem.source ? (
                                <div
                                    className="text-white self-end text-right"
                                    style={{ fontSize: "3rem", lineHeight: 1.2 }}
                                >
                                    {activeItem.source}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </>
            )}
        </footer>
    );
}
