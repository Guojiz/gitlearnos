# Optional OpenSpace Integration

[中文](README.zh-CN.md)

[OpenSpace](https://github.com/HKUDS/OpenSpace) may later evaluate, discover, or
propose improvements to generic GitLearnOS Skills. GitLearnOS borrows the idea
that capabilities should remain inspectable packages, but does not adopt the
OpenSpace runtime. It is not required to run GitLearnOS and is not part of the
v2 acceptance gate.

Integration boundaries:

- GitLearnOS Skills remain ordinary readable Skill packages;
- only synthetic or explicitly approved evaluation traces may be supplied;
- real learner records are excluded by default;
- evolved Skills remain candidates until reviewed and committed;
- the learner's Git repository remains the source of truth.

No OpenSpace runtime is installed or configured by this repository.
