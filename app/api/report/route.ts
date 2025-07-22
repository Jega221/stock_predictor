import { NextRequest, NextResponse } from 'next/server';
import { dates } from '@/utils/dates';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { tickers } = await req.json() as { tickers: string[] };

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json({ error: 'No tickers supplied' }, { status: 400 });
    }

    // 1. Fetch OHLC data for each ticker from Polygon
    const rawData = await Promise.all(
      tickers.map(async (tkr) => {
        const url =
          `https://api.polygon.io/v2/aggs/ticker/${tkr}/range/1/day/` +
          `${dates.startDate}/${dates.endDate}?apiKey=${process.env.POLYGON_API_KEY}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Polygon error for ${tkr}`);

        // send just the JSON string (short) back to GPT
        const json = await res.json();
        return `STOCK: ${tkr}\n${JSON.stringify(json.results)}`;
      })
    );

    // 2. Ask GPT-4 for a 150-word recommendation
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a trading guru. Using the JSON data supplied, write ≤150 words describing performance of each stock and recommend buy / hold / sell.'
        },
        { role: 'user',
          content: rawData.join('\n\n') }
      ]
    });

    return NextResponse.json({ report: completion.choices[0].message.content });
  } catch (err: unknown) { // Changed from 'any' to 'unknown'
    console.error(err);
    // You might want to refine the error message based on the type of 'err'
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown server error occurred' }, { status: 500 });
  }
}