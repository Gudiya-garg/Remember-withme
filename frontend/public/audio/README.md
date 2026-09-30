# Audio Assets — Music Memory Game

Place your MP3 files in **this exact folder** so the Music Memory game can play them.

## Expected files

| Filename    | Song title                        | Artist                      |
|-------------|-----------------------------------|-----------------------------|
| `song1.mp3` | Kabhi Kabhie Mere Dil Mein        | Mukesh & Lata Mangeshkar    |
| `song2.mp3` | Lag Ja Gale                       | Lata Mangeshkar             |
| `song3.mp3` | Ae Dil Hai Mushkil                | Mohammed Rafi               |

## How to add your own songs

1. Rename your MP3 file to `song1.mp3`, `song2.mp3`, or `song3.mp3`.
2. Drop it into `frontend/public/audio/`.
3. The Vite dev server will serve it at `http://localhost:3000/audio/song1.mp3`.

## Changing song metadata

To update song titles, artist names, or memory notes, edit:

```
backend/src/agents/gameGenerationAgent.ts  →  createMusicMemoryGame()  →  songs array
```

> **Note:** Do NOT commit copyrighted commercial recordings to version control.  
> For demo purposes, you may use royalty-free audio from [freemusicarchive.org](https://freemusicarchive.org)  
> or [pixabay.com/music](https://pixabay.com/music).
