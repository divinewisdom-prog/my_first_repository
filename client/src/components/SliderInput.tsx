interface SliderInputProps {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    showGradient?: boolean;
    unit?: string;
}

const SliderInput = ({ label, value, min, max, onChange, showGradient = false, unit = '' }: SliderInputProps) => {
    const percentage = ((value - min) / (max - min)) * 100;



    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">{label}</label>
                <span className="text-lg font-bold text-primary">
                    {value}{unit}
                </span>
            </div>
            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer slider-thumb"
                    style={{
                        background: showGradient
                            ? `linear-gradient(to right, #f87171 0%, #fbbf24 50%, #34d399 100%)`
                            : `linear-gradient(to right, #1D9BF0 0%, #1D9BF0 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
                    }}
                />
            </div>
            <style>{`
                .slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: white;
                    box-shadow: 0 4px 12px rgba(29, 155, 240, 0.4);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .slider-thumb::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 16px rgba(29, 155, 240, 0.6);
                }
                .slider-thumb::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: white;
                    box-shadow: 0 4px 12px rgba(29, 155, 240, 0.4);
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                .slider-thumb::-moz-range-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 16px rgba(29, 155, 240, 0.6);
                }
            `}</style>
        </div>
    );
};

export default SliderInput;
