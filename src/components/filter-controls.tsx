"use client"

import { useState } from "react"
import * as Slider from "@radix-ui/react-slider";
import { useRouter } from "next/navigation"

export default function FilterControls() {
    const router = useRouter()
    const [duration, setDuration] = useState([90]) // Default to 90 minutes

    // Duration labels
    const durationLabels = [
        { value: 10, label: "<10m" },
        { value: 30, label: "30m" },
        { value: 60, label: "1h" },
        { value: 90, label: "1.5h" },
        { value: 120, label: "2h+" },
    ]

    // Get the closest duration label
    const getCurrentDurationLabel = () => {
        const currentValue = duration[0]
        let closestLabel = durationLabels[0]

        for (const label of durationLabels) {
            if (Math.abs(label.value - currentValue) < Math.abs(closestLabel.value - currentValue)) {
                closestLabel = label
            }
        }

        return closestLabel.label
    }

    return (
        <div>
            {/* Duration Filter */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-gray-300 text-sm">Duration:</label>
                    <span className="text-purple-200 font-medium">{getCurrentDurationLabel()}</span>
                </div>
                <div className="px-1">
                    <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5"
                        value={duration}
                        onValueChange={setDuration}
                        max={120}
                        min={10}
                        step={1}
                    >
                        <Slider.Track className="bg-gray-700 relative grow rounded-full h-[3px]">
                            <Slider.Range className="absolute bg-gradient-to-r from-pink-400 to-purple-500 rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow hover:bg-pink-500 focus:outline-none" />
                    </Slider.Root>

                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                        {durationLabels.map((label, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <span className="h-1 w-1 rounded-full bg-gray-500 mb-1"></span>
                                {label.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
