## Climbability Score (v1)

The climbability score is intentionally simple and transparent.
It estimates how quickly a crag may dry based only on wind direction and wind speed.

### Why only wind?

Wind is one of the strongest real-time factors for drying rock:

It removes surface moisture
It can dry rock even after rain
It varies hour by hour (unlike rock type or style)

Other factors (rock type, rain history, overhang/slab) are shown to the user, but not included in the score.
This keeps the score easy to understand and avoids overfitting.


### How the score works

The score is based on two components:

1. **Wind alignment (direction vs crag orientation)**

We calculate how directly the wind hits the crag.


| Angle difference | Meaning    | Score |
| ---------------- | ---------- | ----- |
| < 45°            | Direct hit | 1.0   |
| < 90°            | Angled     | 0.7   |
| < 135°           | Crosswind  | 0.4   |
| ≥ 135°           | Sheltered  | 0.1   |



This is a heuristic model (основанный на интуиции).



2. **Wind strength (normalized)**

Wind speed is scaled to a value between 0 and 1:

```windFactor = min(windSpeed / 10, 1)```

- 0–2 m/s → weak drying
- ~5 m/s → decent
- ≥10 m/s → maximum effect

We cap at 10 m/s because stronger wind does not significantly improve drying in this model.

3. **Final score**
```score = alignment × windFactor```

This means:

- If wind is strong but not hitting the crag → low score
- If wind hits perfectly but is weak → low score
- Only a good combination of both gives a high score

Final output is scaled to 0–100.