/**
 * demo-bruteforce-verbose.js
 *
 * Versi: verbose (menampilkan target, tiap percobaan, dan iterasi)
 * Aman — hanya lokal (target ada di memori). Jangan gunakan pada layanan nyata.
 */

const bcrypt = require('bcryptjs');

// --- CONFIG ---
const TARGET_PLAIN = 'abcd1234'; // ganti sendiri (HANYA lokal)
const SALT_ROUNDS = 10;

const CHARSET = 'abcd01234'; // kecil supaya demo cepat (ubah dengan hati-hati)
const MAX_LENGTH = 8; // batasi untuk mencegah output masif
const MAX_TRIES = 5_000_000_000; // safety stop
const DELAY_MS = 0; // tambahkan delay untuk simulasi rate-limit (ms)
// ---------------

const targetHash = bcrypt.hashSync(TARGET_PLAIN, SALT_ROUNDS);

console.log('--- Demo Bruteforce (VERBOSE, AMAN, LOKAL) ---');
console.log('Target (plain):', TARGET_PLAIN);
console.log('Target (bcrypt hash):', targetHash);
console.log('Charset:', CHARSET);
console.log('Max guess length:', MAX_LENGTH);
console.log('Max tries:', MAX_TRIES);
console.log('Delay per try (ms):', DELAY_MS);
console.log('------------------------------------------------\n');

let tries = 0;
let found = false;
const startTime = Date.now();

function* bruteGenerator(charset, maxLen) {
  for (let len = 1; len <= maxLen; len++) {
    const idx = Array(len).fill(0);
    while (true) {
      yield idx.map((i) => charset[i]).join('');
      let pos = len - 1;
      while (pos >= 0) {
        idx[pos]++;
        if (idx[pos] < charset.length) break;
        idx[pos] = 0;
        pos--;
      }
      if (pos < 0) break;
    }
  }
}

async function runVerboseDemo() {
  const gen = bruteGenerator(CHARSET, MAX_LENGTH);
  for (const guess of gen) {
    tries++;

    // Safety stop
    if (tries > MAX_TRIES) {
      console.log(
        `Stopped: reached MAX_TRIES (${MAX_TRIES}) without finding the password.`
      );
      break;
    }

    const currentStartTime = Date.now();
    // Lakukan perbandingan (simulasi server-side hashed compare)
    const match = bcrypt.compareSync(guess, targetHash);

    // CETAK tiap proses percobaan dan iterasi
    console.log(
      `[Attempt #${tries}] guess="${guess}" -> match=${match}, time=${
        Date.now() - currentStartTime
      }ms`
    );

    if (match) {
      const dt = (Date.now() - startTime) / 1000;
      console.log(
        `\nFOUND! password="${guess}" after ${tries} tries in ${dt.toFixed(3)}s`
      );
      found = true;
      break;
    }

    // Optional delay untuk mensimulasikan rate-limiting / memperlambat output
    if (DELAY_MS > 0) await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  if (!found) {
    const elapsed = (Date.now() - startTime) / 1000;
    console.log(
      `\nNot found within limits. Tries=${tries}, elapsed=${elapsed.toFixed(
        2
      )}s`
    );
  }

  console.log('\nMitigasi (diskusikan setelah demo):');
  console.log('- Hashing (bcrypt/argon2) & salt.');
  console.log('- Rate limiting & lockout.');
  console.log('- MFA dan kebijakan password kuat.');
}

runVerboseDemo();
