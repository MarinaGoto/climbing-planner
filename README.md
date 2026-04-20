## Climbability Engine - MVP


TODOs:


1. Core data model
 - Define Crag type (name, rockType, angle, exposure, special flags)
 - Create hardcoded dataset (start with Llanberis + 5–10 crags)
 - Normalize rock types:

slate; 
granite/rhyolite (group together for now); 
limestone; 
gritstone

2. Conditions/weather model (input state)
-  Define Conditions object
  
3. Scoring engine (core logic)
 - Implement base drying time per rock type
 - Add modifiers:
 - 
rain history → increases wetness
wind → reduces wetness
crag angle (slab/vertical/overhang)

 - Add special rules:
  
sandstone → unsafe when wet; 
caves / slate quarries → faster drying bonus

- Output:

score (0–100);
label (Excellent / Good / Marginal / No-go); 
short explanation string