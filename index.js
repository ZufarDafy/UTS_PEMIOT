const path = require("path");
const express = require("express");
const app = express();
const { json } = require("express/lib/response");
const readline = require("node:readline");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.set("trust proxy", true);

app.use(express.static(path.join(__dirname, "/static")));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

let jsondata = {
  suhumax: 36,
  suhumin: 21,
  suhurata: 28.35,
  nilai_suhu_max_humid_max: [
    {
      idx: 101,
      suhu: 36,
      humid: 36,
      kecerahan: 25,
      timestamp: "2010-09-18 07:23:48",
    },
    {
      idx: 226,
      suhu: 36,
      humid: 36,
      kecerahan: 27,
      timestamp: "2011-05-02 12:29:34",
    },
  ],
  month_year_max: [
    {
      month_year: "9-2010",
    },
    {
      month_year: "5-2011",
    },
  ],
};

function inputSuhu() {
  let suhu;
  let humid;
  let kecerahan;
  // let json = {
  //   suhumax: 36,
  //   suhumin: 20,
  //   suhurata: 20,
  //   nilai_suhu_max_humix_max: [
  //     {
  //       idx: 101,
  //       suhu: 36,
  //       humid: 36,
  //       kecerahan: 27,
  //       timestamp: "2010-09-18 07:28:00",
  //     },
  //   ],
  // };

  // const json = {
  //   suhumax: 36,
  //   suhumin: 20,
  //   suhurata: 20,
  //   nilai_suhu_max_humid_max: [
  //     {
  //       idx: 101,
  //       suhu: 36,
  //       humid: 36,
  //       kecerahan: 27,
  //       timestamp: "2010-09-18 07:28:00",
  //     },
  //   ],
  //   month_year_max: [
  //     {
  //       month_year: "9-2010",
  //     },
  //     {
  //       month_year: "5-2011",
  //     },
  //   ],
  // };
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(`Masukkan suhu: `, (suhu) => {
      console.log(`Hi ${name}!`);
      rl.close();
      resolve(json); // Kembalikan data setelah selesai
    });
  });
}

function updateSuhu(idx, suhu, humid, kecerahan) {
  const currentDateTime = new Date();

  const formattedTimestamp = currentDateTime
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  jsondata.nilai_suhu_max_humid_max.push({
    idx: idx,
    suhu: suhu,
    humid: humid,
    kecerahan: kecerahan,
    timestamp: formattedTimestamp,
  });

  const suhuValues = jsondata.nilai_suhu_max_humid_max.map(
    (entry) => entry.suhu
  );

  // Calculate suhumax
  jsondata.suhumax = Math.max(...suhuValues);

  // Calculate suhumin
  jsondata.suhumin = Math.min(...suhuValues);

  // Calculate suhurata
  jsondata.suhurata =
    suhuValues.reduce((sum, current) => sum + current, 0) / suhuValues.length;

  const dates = jsondata.nilai_suhu_max_humid_max.map(
    (entry) => new Date(entry.timestamp)
  );
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const formatMonthYear = (date) =>
    `${date.getMonth() + 1}-${date.getFullYear()}`;
  jsondata.month_year_max[0].month_year = formatMonthYear(minDate);
  jsondata.month_year_max[1].month_year = formatMonthYear(maxDate);

  console.log(jsondata);
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/suhu", async (req, res) => {
  // try {
  //   let a = await inputSuhu();
  //   console.log(a);
  //   res.send(a);
  // } catch (error) {
  //   res.status(500).send("Terjadi kesalahan dalam server");
  // }
  res.send(jsondata);
});

app.post("/suhu", async (req, res) => {
  const { idx, suhu, humidity, kecerahan } = req.body;

  await updateSuhu(
    parseFloat(idx),
    parseFloat(suhu),
    parseFloat(humidity),
    parseFloat(kecerahan)
  );
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Example app listening on port http://localhost:3000");
});
