import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const CHAPTERS_EN = [
  [
    "ch01_hook",
    "In India today, you tap a yellow icon on your phone... and before you can even boil water for tea, a rider is ringing your doorbell. Milk, batteries, a charger, even a brand-new iPhone, delivered in nine minutes flat. That yellow app is Blinkit. Today it processes over nine hundred million orders a year, and powers thirty-seven thousand crore rupees in revenue. But four years ago... Wall Street called it a suicide mission, and the company was weeks away from running out of cash."
  ],
  [
    "ch02_origin",
    "Rewind to December twenty thirteen in Gurugram. Two IIT graduates, Albinder Dhindsa and Saurabh Kumar, noticed a broken link in urban India. Neighborhood kirana stores had everything on their shelves... yet nobody had a reliable rider network to bring those bags home. They launched a local delivery service called On-Number... and soon rebranded it to Grofers."
  ],
  [
    "ch03_slotted",
    "For seven years, Grofers chased the scheduled supermarket dream. You ordered groceries today... and a van delivered them tomorrow afternoon. Investors poured in over six hundred million dollars from SoftBank and Tiger Global. Yet the math was a trap. Giant warehouses on city outskirts meant huge fuel costs, low-margin staples, and customers who only opened the app twice a month."
  ],
  [
    "ch04_pivot",
    "By twenty twenty-one, Amazon, Flipkart, and BigBasket had boxed Grofers into a corner. A planned NASDAQ listing collapsed. Then Albinder looked at a shocking piece of internal data. Whenever deliveries arrived in under twenty minutes... customer retention tripled. In mid twenty twenty-one, Grofers made an all-or-nothing gamble. They shut down next-day slots, and promised groceries in ten minutes. And on December thirteenth, twenty twenty-one... Grofers became Blinkit."
  ],
  [
    "ch05_invasion",
    "Overnight, a gold rush exploded across Indian tech. Nineteen-year-old founders launched Zepto. Swiggy poured hundreds of millions into Instamart. Reliance-backed Dunzo pivoted to Dunzo Daily, and Ola launched Ola Dash. Every street corner became a war zone of dark stores and cash burn... losing over a hundred rupees on every single bag."
  ],
  [
    "ch06_slaughter",
    "Then came the twenty twenty-two global tech winter. Venture funding froze overnight. Ola Dash shut down within months. Dunzo burned through its treasury, delayed salaries, and collapsed into oblivion. Blinkit itself was bleeding heavily... shutting dark stores and taking an emergency hundred-and-fifty-million-dollar lifeline from Zomato just to stay alive."
  ],
  [
    "ch07_acquisition",
    "In June twenty twenty-two, Zomato CEO Deepinder Goyal stepped in with the most controversial acquisition in Indian startup history. Zomato bought Blinkit in an all-stock deal for four thousand four hundred and forty-seven crore rupees... a forty-three percent haircut from its billion-dollar peak. Investors were furious. Zomato's share price crashed toward forty rupees, erasing billions in market value as analysts mocked the deal as catching a falling knife."
  ],
  [
    "ch08_physics",
    "Critics thought ten-minute delivery meant riders driving recklessly through traffic. They misunderstood the engineering. Blinkit did not speed up the bike... it shrank the distance. By placing compact dark stores every one point five kilometers, and mapping high-velocity shelves by pick frequency, orders were packed in ninety seconds. The rider only traveled one point eight kilometers at fifteen kilometers an hour."
  ],
  [
    "ch09_margins",
    "Next came the profit engine. Blinkit stopped being just a milk-and-onion app. It added high-margin electronics, cosmetics, festive pooja kits, and emergency gifts. Average order values surged past six hundred and sixty rupees. Brands began paying hundreds of crores just to advertise inside the Blinkit search bar. In March twenty twenty-four... Blinkit shocked the market by turning Adjusted EBITDA positive."
  ],
  [
    "ch10_empire",
    "By twenty twenty-six, the ugly duckling had overtaken its parent. Under the rebranded corporate giant Eternal, Blinkit scaled to over two thousand two hundred dark stores... commanding forty-six percent of India's eleven-billion-dollar quick-commerce market, ahead of Zepto and Swiggy Instamart. What began as a desperate pivot at the edge of bankruptcy proved one timeless rule of business... when your old model is dying, only the bold enough to cannibalize themselves survive."
  ]
];

const CHAPTER_GAPS = {
  ch01_hook: 0.50,
  ch02_origin: 0.35,
  ch03_slotted: 0.35,
  ch04_pivot: 0.35,
  ch05_invasion: 0.35,
  ch06_slaughter: 0.35,
  ch07_acquisition: 0.35,
  ch08_physics: 0.35,
  ch09_margins: 0.35,
  ch10_empire: 0.40,
};

const OUT_DIR = path.resolve("public/audio/chapters");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function synthChapter(cid, text) {
  const wavPath = path.join(OUT_DIR, `${cid}.wav`);
  const metaJsonPath = path.join(OUT_DIR, `${cid}.words.json`);

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(
        "en-US-AndrewNeural",
        OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
        { wordBoundaryEnabled: true }
      );
      const tmpDir = path.join(OUT_DIR, `tmp_${cid}`);
      fs.mkdirSync(tmpDir, { recursive: true });

      const { audioFilePath, metadataFilePath } = await tts.toFile(tmpDir, text, {
        rate: "+14%",
        pitch: "+0Hz",
      });
      tts.close();

      // Convert MP3 to 48kHz mono WAV
      execFileSync("ffmpeg", [
        "-y",
        "-i",
        audioFilePath,
        "-ar",
        "48000",
        "-ac",
        "1",
        "-c:a",
        "pcm_s16le",
        wavPath,
      ], { stdio: "ignore" });

      let rawMeta = [];
      if (metadataFilePath && fs.existsSync(metadataFilePath)) {
        const parsed = JSON.parse(fs.readFileSync(metadataFilePath, "utf8"));
        rawMeta = Array.isArray(parsed) ? parsed : (parsed.Metadata || []);
      }

      const words = [];
      for (const item of rawMeta) {
        const entries = item.Metadata || [item];
        for (const entry of entries) {
          if (entry.Type === "WordBoundary" && entry.Data) {
            const offsetSec = (entry.Data.Offset || 0) / 1e7;
            const durSec = (entry.Data.Duration || 0) / 1e7;
            const wordText = entry.Data.text?.Text || entry.Data.Text || "";
            if (wordText) {
              words.push({
                loc: Number(offsetSec.toFixed(3)),
                dur: Number(durSec.toFixed(3)),
                w: wordText,
              });
            }
          }
        }
      }

      fs.writeFileSync(metaJsonPath, JSON.stringify(words, null, 2));
      fs.rmSync(tmpDir, { recursive: true, force: true });
      console.log(`Synthesized ${cid}: ${words.length} words`);
      return { wavPath, words };
    } catch (err) {
      console.warn(`Attempt ${attempt} failed for ${cid}:`, err.message);
      await new Promise((r) => setTimeout(r, 900 * attempt));
      if (attempt === 4) throw err;
    }
  }
}

function getWavDuration(wavPath) {
  const buf = fs.readFileSync(wavPath);
  // Find 'data' chunk in WAV header
  let offset = 12;
  while (offset < buf.length - 8) {
    const chunkId = buf.toString("ascii", offset, offset + 4);
    const chunkSize = buf.readUInt32LE(offset + 4);
    if (chunkId === "data") {
      // 48000 Hz, 1 channel, 2 bytes per sample = 96000 bytes/sec
      return chunkSize / 96000;
    }
    offset += 8 + chunkSize;
  }
  return (buf.length - 44) / 96000;
}

async function main() {
  // Process with concurrency = 2
  const results = {};
  const queue = [...CHAPTERS_EN];
  async function worker() {
    while (queue.length > 0) {
      const [cid, text] = queue.shift();
      results[cid] = await synthChapter(cid, text);
    }
  }
  await Promise.all([worker(), worker()]);

  let cur = 0.40;
  const chaptersOut = [];

  console.log("\n================ PHRASE MAP ================");
  for (const [cid, text] of CHAPTERS_EN) {
    const gap = CHAPTER_GAPS[cid] ?? 0.35;
    cur += gap;
    const start = cur;
    const { wavPath, words } = results[cid];
    const dur = getWavDuration(wavPath);
    const end = start + dur;
    cur = end;

    const globalWords = words.map((w) => ({
      g: Number((start + w.loc).toFixed(3)),
      loc: w.loc,
      dur: w.dur,
      w: w.w,
    }));

    chaptersOut.push({
      cid,
      start: Number(start.toFixed(3)),
      end: Number(end.toFixed(3)),
      dur: Number(dur.toFixed(3)),
      text,
      words: globalWords,
    });

    console.log(`\n--- ${cid} [${start.toFixed(2)}s -> ${end.toFixed(2)}s] (dur ${dur.toFixed(2)}s) ---`);
    let phrase = [];
    let phraseStart = start;
    for (let i = 0; i < globalWords.length; i++) {
      const gw = globalWords[i];
      if (i === 0) {
        phraseStart = gw.g;
        phrase.push(gw.w);
      } else {
        const prev = globalWords[i - 1];
        const silenceGap = gw.g - (prev.g + prev.dur);
        const startDiff = gw.g - prev.g;
        if (silenceGap >= 0.18 || startDiff >= 0.42) {
          console.log(`[${phraseStart.toFixed(2).padStart(6, " ")}s] ${phrase.join(" ")}`);
          phrase = [gw.w];
          phraseStart = gw.g;
        } else {
          phrase.push(gw.w);
        }
      }
    }
    if (phrase.length > 0) {
      console.log(`[${phraseStart.toFixed(2).padStart(6, " ")}s] ${phrase.join(" ")}`);
    }
  }

  const totalDuration = Number((cur + 1.80).toFixed(3));
  const wordMap = {
    totalDuration,
    chapters: chaptersOut,
  };

  fs.mkdirSync("public/audio", { recursive: true });
  fs.mkdirSync("src/lib", { recursive: true });
  fs.writeFileSync("public/audio/word_map.json", JSON.stringify(wordMap, null, 2));
  fs.writeFileSync("src/lib/word_map.json", JSON.stringify(wordMap, null, 2));
  console.log(`\nSaved word_map.json — TOTAL DURATION: ${totalDuration.toFixed(3)}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
