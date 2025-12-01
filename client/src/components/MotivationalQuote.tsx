import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const quotes = [
    "Consistency is the secret of success.",
    "Small steps every day lead to big results.",
    "Your health is your greatest wealth.",
];

export const MotivationalQuote: React.FC = () => (
    <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={8000}
        stopOnHover={false}
        swipeable={true}
        emulateTouch={true}
        className="bg-slate-800/30 rounded-xl p-4"
    >
        {quotes.map((q, i) => (
            <div key={i} className="p-4 text-center text-slate-200">
                <p className="italic text-lg">{q}</p>
            </div>
        ))}
    </Carousel>
);
