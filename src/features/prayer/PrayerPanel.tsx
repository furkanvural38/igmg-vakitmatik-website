// src/features/prayer/PrayerPanel.tsx
import { type JSX, useMemo } from "react";
import { useCity } from "../../app/CityProvider";
import { usePrayerTimeLogic } from "./usePrayerTimeLogic";

import { FaMoon } from "react-icons/fa6";
import { HiOutlineSun } from "react-icons/hi";
import { AiFillSun } from "react-icons/ai";
import { PiSunHorizonFill, PiSunHorizonLight } from "react-icons/pi";
import { LuCloudSun } from "react-icons/lu";

import { useChangeTitle } from "./useChangeTitle.ts";
import { WeatherCard } from "../weather/WeatherCard";

// Reihenfolge streng typisiert
const ORDER = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerKey = typeof ORDER[number];

const GREEN = "#009972";

const ICONS: Record<PrayerKey, JSX.Element> = {
    fajr: <PiSunHorizonLight />,
    sunrise: <HiOutlineSun />,
    dhuhr: <AiFillSun />,
    asr: <LuCloudSun />,
    maghrib: <PiSunHorizonFill />,
    isha: <FaMoon />,
};

const PRAYER_LABELS: Record<PrayerKey, string> = {
    fajr: "İmsak",
    sunrise: "Güneş",
    dhuhr: "Öğle",
    asr: "İkindi",
    maghrib: "Akşam",
    isha: "Yatsı",
};

function PrayerTile({
                        k,
                        titleLine,
                        time,
                        active,
                        progress,
                        diffLabelShort,
                    }: {
    k: PrayerKey;
    titleLine: string;
    time: string;
    active: boolean;
    progress: number;
    diffLabelShort: string;
}) {
    return (
        <div
            className={[
                "relative flex flex-col items-center",
                "w-[24rem] h-[24rem]",
                "mt-8",
                "glass-card",
                active ? "glass-animate-in" : "",
                active && progress > 10
                    ? "bg-[radial-gradient(circle_at_50%_50%,rgba(255,59,48,0.15)_0%,rgba(0,0,0,0)_70%)]"
                    : active
                        ? "bg-[radial-gradient(circle_at_50%_50%,rgba(0,153,114,0.15)_0%,rgba(0,0,0,0)_70%)]"
                        : "",
            ].join(" ")}
        >
            {active && (
                <div
                    className={progress > 90 ? "glass-deactive-ring" : "glass-active-ring"}
                    style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "inherit" }}
                />
            )}

            {active && (
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full px-2 text-white z-[5]">
                    <div className="text-center text-white mb-4 text-6xl">{diffLabelShort}</div>
                    {/* Track grau, Füllung farbig */}
                    <div className="h-8 relative w-full rounded-3xl overflow-hidden bg-[#4b4b4b] glass-text">
                        <div
                            className={(progress > 90 ? "bg-red-500" : "bg-[#009972]") + " h-full"}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center justify-start text-center z-[4] pt-2 relative">
                {/* Icon */}
                <div className={(active ? "text-white" : "text-[#a7a7a7]") + " text-8xl mb-4"}>
                    {ICONS[k]}
                </div>

                {/* rotiert (arabisch/latein) */}
                <span className={(active ? "text-white" : "text-[#a7a7a7]") + " text-5xl mb-6"}>
          {titleLine || "-"}
        </span>

                {/* statischer türkischer Name */}
                <span className={(active ? "text-white" : "text-[#a7a7a7]") + " text-7xl font-semibold"}>
          {PRAYER_LABELS[k]}
        </span>

                {/* Uhrzeit */}
                <span
                    className={(active ? "text-white" : "text-[#a7a7a7]") + " font-semibold mt-4 text-[6rem] leading-none"}
                >
          {time}
        </span>
            </div>
        </div>
    );
}

export function PrayerPanel(): JSX.Element {
    const { clock, prayerTimes, weather } = useCity();
    const { currentPrayer, diffLabelShort, progressPercentage } = usePrayerTimeLogic(clock, prayerTimes);
    const titles = useChangeTitle();

    // Uhrzeit HH:MM:SS
    const timeParts = useMemo(() => {
        const hh = clock.getHours().toString().padStart(2, "0");
        const mm = clock.getMinutes().toString().padStart(2, "0");
        const ss = clock.getSeconds().toString().padStart(2, "0");
        return { hh, mm, ss };
    }, [clock]);

    // Datum (gregorianisch)
    const gregorianDate = useMemo(() => {
        const d = clock;
        const dd = d.getDate().toString().padStart(2, "0");
        const mo = (d.getMonth() + 1).toString().padStart(2, "0");
        const yyyy = d.getFullYear().toString();
        return `${dd}.${mo}.${yyyy}`;
    }, [clock]);

    // Hijri-Datum
    const hijriDate = prayerTimes?.hijriDateLong ?? "--";


    return (
        <div className="w-full flex flex-col items-stretch text-white select-none relative z-[1]">
            {/* 1) Datum / Uhr / Wetter */}
            <div className="flex flex-row items-center justify-between w-full px-4">
                {/* Datum links */}
                <div className="flex flex-col min-w-[400px]">
                    {/* Gregorianisches Datum */}
                    <div
                        className="
              glass-card glass-animate-in
              flex items-center justify-center text-center
              text-white font-semibold
              rounded-2xl shadow-lg
              px-8 py-6
              mb-6
            "
                        style={{
                            fontSize: "4rem",
                            lineHeight: 1.1,
                            backgroundColor: `${GREEN}40`,
                        }}
                    >
                        <div className="glass-card-content">{gregorianDate}</div>
                    </div>

                    {/* Hijri-Datum */}
                    <div
                        className="
              glass-card
              flex items-center justify-center text-center
              text-white font-light
              rounded-2xl shadow-md
              px-8 py-6
            "
                        style={{
                            fontSize: "4rem",
                            lineHeight: 1.1,
                            borderColor: "rgba(255,255,255,0.3)",
                        }}
                    >
                        <div className="glass-card-content">{hijriDate}</div>
                    </div>
                </div>

                {/* Uhrzeit in der Mitte */}
                <div className="flex flex-row font-bebas items-end justify-center text-white leading-none font-extrabold tracking-tight text-center">
                    <div className="text-clock leading-[0.8]">
                        {timeParts.hh}:{timeParts.mm}
                    </div>
                    <div className="text-seconds leading-[0.9] ml-2">{timeParts.ss}</div>
                </div>

                {/* Wetter rechts */}
                <WeatherCard
                    cityName={weather?.name}
                    icon={weather?.weather?.[0]?.icon}
                    description={weather?.weather?.[0]?.description}
                    temperatureC={weather?.main?.temp}
                    currentPrayer={currentPrayer as PrayerKey | null}
                />
            </div>

            {/* 2) Gebetszeit-Kacheln */}
            <div
                className="
          w-full
          flex flex-row
          justify-between
          items-start
          px-4
          mt-24
          gap-10
        "
            >
                {!prayerTimes ? (
                    <div className="text-2xl text-neutral-400">Lade Gebetszeiten…</div>
                ) : (
                    ORDER.map((k) => {
                        const isActive = currentPrayer === k;
                        const timeVal = prayerTimes[k] ?? "00:00";
                        return (
                            <PrayerTile
                                key={k}
                                k={k}
                                titleLine={titles[k] ?? "-"}
                                time={timeVal}
                                active={!!isActive}
                                progress={isActive ? progressPercentage : 0}
                                diffLabelShort={isActive ? diffLabelShort : ""}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
