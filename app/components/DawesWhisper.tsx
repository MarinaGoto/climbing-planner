import React from "react";

type WeatherData = {
  rain?: number; // mm
  humidity?: number; // %
};

function getDawesWhisper(weather: WeatherData): string | null {
  if (!weather) return null;

  const { rain = 0, humidity = 0 } = weather;

  if (rain > 0.3 || humidity > 85) {
    const whispers = [
      "still climbable",
      "conditions improving",
      "good friction somewhere",
      "depends how you define dry",
      "some routes prefer this",
    ];

    // stable per day (no flicker)
    const index = new Date().getDate() % whispers.length;

    return whispers[index];
  }

  return null;
}

export const DawesWhisper: React.FC<{ weather: WeatherData }> = ({
  weather,
}) => {
  const whisper = getDawesWhisper(weather);

  if (!whisper) return null;

  return (
    <div
      style={{
        fontSize: "11px",
        opacity: 0.5,
        fontStyle: "italic",
        textAlign: "right",
        marginTop: "4px",
        userSelect: "none",
      }}
      title="— J.D."
    >
      {whisper}
    </div>
  );
};
