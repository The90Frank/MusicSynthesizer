# MusicSynthesizer

A browser-based music sequencer built with vanilla JavaScript and HTML5 Canvas. Compose melodies on an interactive grid using multiple instruments with real-time playback.

## Features

- **32x13 step sequencer** grid - horizontal axis is time, vertical axis is pitch
- **Multiple instruments**: Piano, Guitar (Chitarra), Bass (Basso), Xylophone (Xilofono), and more
- **Click and drag** to draw or erase notes on the grid
- **Adjustable tempo** via speed slider
- **Continued mode** toggle to let notes ring or cut them on each step
- **Color gradient** visualization across the grid for visual feedback

## How to use

1. Open `index.html` in a browser
2. Select an instrument from the dropdown
3. Click or drag on the grid to place notes
4. Press the play button to start the sequencer
5. Adjust the speed slider to change tempo
6. Toggle edit mode between draw and erase

## Project structure

```
MusicSynthesizer/
├── index.html       # Main UI with canvas and controls
├── music.js         # Sequencer logic, rendering, and audio playback
└── src/
    ├── Piano/       # 13 piano WAV samples
    ├── Chitarra/    # 13 guitar WAV samples
    ├── Basso/       # 13 bass WAV samples
    ├── Xilofono/    # 13 xylophone WAV samples
    ├── Clap/        # 13 clap WAV samples
    ├── Conga/       # 13 conga WAV samples
    └── README.md    # Audio samples attribution
```

Audio samples by Laura Bussi, free for non-commercial use.

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.
