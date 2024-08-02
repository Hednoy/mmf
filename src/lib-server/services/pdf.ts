import prisma from "@/lib-server/prisma";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "../vfs_fonts";
import { logo } from "../logo_base64";
import { de } from "@faker-js/faker";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { Lab } from "@prisma/client";
import ApiError from "../error";
import { LabTestPDFData } from "@/types/models/LabTest";
import { convertDateToString, convertDateToStringWithTime } from "@/utils";

pdfMake.vfs = pdfFonts;
pdfMake.fonts = {
  THSarabun: {
    normal: "THSarabun.ttf",
    bold: "THSarabun-Bold.ttf",
    italics: "THSarabun-Italic.ttf",
    bolditalics: "THSarabun-BoldItalic.ttf",
  },
};

const template: TDocumentDefinitions = {
  pageSize: "A4",
  pageMargins: [60, 60, 60, 40],
  content: [],
  defaultStyle: {
    font: "THSarabun",
    // fontSize: 16,
    // alignment: "left",
    // lineHeight: 1.2,
  },
};

export async function PDFlab1(id: number): Promise<Buffer> {
  const lab = await prisma.lab.findUnique({
    where: { id },
    include: {
      TestType: true,
      Hospital: true,
      Patient: true,
      Machine: true,
      InspectionType: true,
    },
  });
  if (!lab) throw new ApiError(`Lab with id: ${id} not found.`, 404);

  const labTestList = await prisma.labTest.findMany({
    where: {
      lab_id: lab.id,
    },
    include: {
      Pathogens: true,
    },
  });

  const labtestPdf: LabTestPDFData = {
    pathogen1: {
      name: labTestList[0]?.Pathogens?.name,
      result: labTestList[0]?.result,
      remark: labTestList[0]?.remark,
    },
    pathogen2: {
      name: labTestList[1]?.Pathogens?.name,
      result: labTestList[1]?.result,
      remark: labTestList[1]?.remark,
    },
    pathogen3: {
      name: labTestList[2]?.Pathogens?.name,
      result: labTestList[2]?.result,
      remark: labTestList[2]?.remark,
    },
    pathogen4: {
      name: labTestList[3]?.Pathogens?.name,
      result: labTestList[3]?.result,
      remark: labTestList[3]?.remark,
    },
  };

  if (lab) {
    template.pageMargins = [20, 20, 20, 20];
    (template.background = function (currentPage, pageSize) {
      return {
        image: logo.base64,
        width: 200,
        height: 200,
        absolutePosition: { x: 200, y: 300 },
        opacity: 0.4,
      };
    }),
      (template.content = [
        [
          {
            columns: [
              {
                image: logo.base64,
                width: 100,
                height: 100,
              },
              {
                text: [
                  {
                    text: "กลุ่มห้องปฏิบัติการสาธารณสุข สถาบันป้องกันควบคุมโรคเขตเมือง ",
                    style: "header",
                  },
                  "\n\n",
                  {
                    text: "24/56 ม.3 ถนนพหลโยธิน แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพฯ 10220 \nโทรศัพท์ 0 2972 9606, E-MAIL: LABIUDCBKK@GMAIL.COM",
                  },
                ],
                margin: [10, 0, 0, 0],
              },
            ],
          },
          {
            text: "รายงานผลการทดสอบ (Laboratory report)",
            margin: [70, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            text: "",
            margin: [90, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],

              body: [
                [
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Name : ", style: "tableKey" },
                      {
                        text:
                          lab?.Patient?.first_name +
                          " " +
                          lab?.Patient?.last_name,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Lab No : ", style: "tableKey" },
                      { text: lab?.case_no, style: "tableValue" },
                      "\n",
                      { text: "ID Card / PASSPORT : ", style: "tableKey" },
                      { text: lab?.Patient?.id_card, style: "tableValue" },
                      "\n",
                      { text: "Organization : ", style: "tableKey" },
                      { text: "", style: "tableValue" },
                      "\n",
                      { text: "Specimens : ", style: "tableKey" },
                      { text: lab?.InspectionType?.name, style: "tableValue" },
                      "\n",
                    ],
                    margin: [0, 5, 0, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "AGE : ", style: "tableKey" },
                      { text: lab?.Patient?.age, style: "tableValue" },
                      "\n",
                      { text: "SAT ID : ", style: "tableKey" },
                      { text: lab?.Patient?.sat_id, style: "tableValue" },
                      "\n",
                    ],
                    alignment: "right",
                    margin: [0, 5, 30, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Sex : ", style: "tableKey" },
                      { text: lab?.Patient?.gender, style: "tableValue" },
                      "\n",
                      { text: "HN : ", style: "tableKey" },
                      { text: lab?.Patient?.hn, style: "tableValue" },
                      "\n",
                      { text: "Collect Date : ", style: "tableKey" },
                      {
                        text:
                          convertDateToString(
                            lab?.Patient?.collected_date ?? null
                          ) +
                          " " +
                          lab?.Patient?.collected_time,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Received Date : ", style: "tableKey" },
                      {
                        text:
                          convertDateToString(
                            lab?.Patient?.received_date ?? null
                          ) +
                          " " +
                          lab?.Patient?.received_time,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Report Date : ", style: "tableKey" },
                      {
                        text: convertDateToStringWithTime(lab?.report_date),
                        style: "tableValue",
                      },
                      "\n",
                    ],
                    margin: [10, 5, 0, 10],
                  },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],
              body: [
                [
                  {
                    text: "Pathogens",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                  { text: "Result", alignment: "center", style: "tableSecVal" },
                  { text: "Remark", alignment: "center", style: "tableSecVal" },
                ],
                [
                  { text: labtestPdf?.pathogen1?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen1?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen1?.remark, style: "tableSecVal" },
                ],
                [
                  { text: labtestPdf?.pathogen2?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen2?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen2?.remark, style: "tableSecVal" },
                ],
                [
                  { text: labtestPdf?.pathogen3?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen3?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen3?.remark, style: "tableSecVal" },
                ],
                [
                  { text: labtestPdf?.pathogen4?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen4?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen4?.remark, style: "tableSecVal" },
                ],
              ],
            },
            layout: {
              fillColor: function (rowIndex: any, node: any, columnIndex: any) {
                return rowIndex === 0 ? "#D7D7D7" : null;
              },

              hLineStyle: function (i: any, node: any) {
                if (i === 0 || i === 1 || i === node.table.body.length) {
                  return null;
                }
                return { dash: { length: 5, space: 2 } };
              },
            },
          },
          {
            text: [
              { text: "Detection Method : ", style: "tableKey" },
              {
                text: lab?.detection_method || "",
                style: "tableValue",
              },
              "\n\n",
              { text: "COMMENT :  ", style: "tableValue" },
              { text: lab?.comment || "", style: "tableValue" },
            ],
          },
          {
            style: "tableExample",
            margin: [0, 70, 0, 0],
            table: {
              widths: [500],

              body: [
                [
                  {
                    border: [false, true, false, false],
                    text: [],
                  },
                ],
              ],
            },
          },
          {
            text: [
              { text: "Reported by : ", style: "tableKey" },
              { text: "xxxxxxxxxxxx", style: "tableValue" },
              "\n\n",
              { text: "Approved by : ", style: "tableKey" },
              { text: "xxxxx", style: "tableValue" },
            ],
          },
          {
            text: [
              { text: "remark", style: "tableValue" },
              "\n",
              {
                text: "1. ใบรายงานผล รองรับเฉพาะตัวอย่างที่ใด้รับการทตสอบในครั้งนี้เท่านั้น",
                style: "tableValue",
              },
              "\n",
              {
                text: "2. ผล Positive ให้ทำการตรวจยืนยันด้วยวิชี RT -PCR และให้กลับไปกักตัวที่บ้านจนกว่าจะทราบผลการตรวจ RT-PCR",
                style: "tableValue",
              },
              "\n",
              {
                text: "3. ผa Negative : ไม่พบเชื้อ",
                style: "tableValue",
              },
              "\n",
              {
                text: "3.1 หากเป็นผู้สัมผัสใกล้ชิดผู้สงสัยสัมผัส แนะนำกักตัว เ4 วัน แยกของใช้ส่วนตัวทุกชนิด เช่น จานช้อน แก้ว ผ้าขนหนู โทรศัพท์ โคยไม่ใช้ร่วมกับผู้อื่น",
                style: "tableValue",
              },
              "\n",
              {
                text: "3.2 สังเกตอาการตนเอง หากพบอาการผิดปกติน มีใข้ ไอ เจ็บคอ มีน้ำมูก จมูกไม่ไดักลิ่น ลิ้นไม่รับรส หรือมีความเสี่ยงที่จะติดเชื้อ ให้เข้ารับการตรวจด้วยธี RT-PCR",
                style: "tableValue",
              },
              "\n",
              {
                text: "4. ผู้ติดเชื้อโควิด-19 รายใหม่ ที่ต้องการเข้า ระบบการดูแลที่บ้าน (Home Isolation) สามารถลงทะเบียนทางเว็บ สปสช.สแกน QR Code และ ทางไลน์",
                style: "tableValue",
              },
              "\n",
            ],
            margin: [70, 30, 0, 0],
          },
        ],
      ]);

    template.styles = {
      header: {
        fontSize: 14,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      tableKey: {
        fontSize: 10,
        bold: true,
      },
      tableValue: {
        fontSize: 10,
      },
      tableSecVal: {
        fontSize: 11,
        bold: true,
        margin: [0, 2, 0, 2],
      },
    };

    // pdfMake.createPdf(template).open();
  }
  return new Promise((resolve, reject) => {
    try {
      const doc = pdfMake.createPdf(template);
      doc.getBuffer(async function (buffer) {
        resolve(buffer);
      });
    } catch (e) {
      reject("Error pdfMake.createPdf()");
    }
  });
}

export async function PDFlab2(id: number): Promise<Buffer> {
  const lab = await prisma.lab.findUnique({
    where: { id },
    include: {
      TestType: true,
      Hospital: true,
      Patient: true,
      Machine: true,
      InspectionType: true,
    },
  });
  if (!lab) throw new ApiError(`Lab with id: ${id} not found.`, 404);

  const labTestList = await prisma.labTest.findMany({
    where: {
      lab_id: lab.id,
    },
    include: {
      Pathogens: true,
    },
  });

  const labtestPdf: LabTestPDFData = {
    pathogen1: {
      name: labTestList[0]?.Pathogens?.name,
      result: labTestList[0]?.result,
      remark: labTestList[0]?.remark,
    },
    pathogen2: {
      name: labTestList[1]?.Pathogens?.name,
      result: labTestList[1]?.result,
      remark: labTestList[1]?.remark,
    },
    pathogen3: {
      name: labTestList[2]?.Pathogens?.name,
      result: labTestList[2]?.result,
      remark: labTestList[2]?.remark,
    },
    pathogen4: {
      name: labTestList[3]?.Pathogens?.name,
      result: labTestList[3]?.result,
      remark: labTestList[3]?.remark,
    },
  };

  if (lab?.Machine.name == "FM 02-001(C) ใบรายงานผล COVID-19 (ระบบ MP)") {
    template.pageMargins = [20, 20, 20, 20];
    (template.background = function (currentPage, pageSize) {
      return {
        image: logo.base64,
        width: 200,
        height: 200,
        absolutePosition: { x: 200, y: 300 },
        opacity: 0.4,
      };
    }),
      (template.content = [
        [
          {
            columns: [
              {
                image: logo.base64,
                width: 100,
                height: 100,
              },
              {
                text: [
                  {
                    text: "Public Health Laboratory, Institute for Urban Disease Control and Prevention ",
                    style: "header",
                  },
                  "\n\n",
                  {
                    text: "24/56 Phahonynthin Rd, Anusawari, Rang-khen. Rangknk 10770 \nTel +66 2972 9606, +66 96 0966075, E-mail: labiudcbkk@gmail.com",
                  },
                ],
                margin: [10, 0, 0, 0],
              },
            ],
          },
          {
            text: "Laboratory report",
            margin: [70, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            text: "Detection of Genetic Substances of COVID-19",
            margin: [90, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],

              body: [
                [
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Name : ", style: "tableKey" },
                      {
                        text:
                          lab?.Patient?.first_name +
                          " " +
                          lab?.Patient?.last_name,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Age : ", style: "tableKey" },
                      { text: lab?.Patient?.age, style: "tableValue" },
                      "\n",
                      { text: "Organization : ", style: "tableKey" },
                      { text: "", style: "tableValue" },
                      "\n",
                      { text: "Register Date : ", style: "tableKey" },
                      {
                        text: convertDateToString(
                          lab?.Patient?.collected_date ?? null
                        ),
                        style: "tableValue",
                      },
                      "\n",
                    ],
                    margin: [0, 5, 0, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Lab Number : ", style: "tableKey" },
                      { text: lab?.id, style: "tableValue" },
                      "\n",
                      { text: "Sex : ", style: "tableKey" },
                      { text: lab?.Patient?.gender, style: "tableValue" },
                      "\n",
                    ],
                    alignment: "right",
                    margin: [0, 5, 30, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "", style: "tableKey" },
                      { text: "", style: "tableValue" },
                      "\n",
                      { text: "ID : ", style: "tableKey" },
                      { text: lab?.Patient?.id_card, style: "tableValue" },
                      "\n",
                      //   { text: "Collect Date : ", style: "tableKey" },
                      //   {
                      //     text: convertDateToString(
                      //       lab?.Patient?.collected_date ?? null
                      //     ),
                      //     style: "tableValue",
                      //   },
                      //   "\n",
                      //   { text: "Received Date : ", style: "tableKey" },
                      //   {
                      //     text: convertDateToString(
                      //       lab?.Patient?.received_date ?? null
                      //     ),
                      //     style: "tableValue",
                      //   },
                      //   "\n",
                      //   { text: "Report Date : ", style: "tableKey" },
                      //   { text: "", style: "tableValue" },
                      //   "\n",
                    ],
                    margin: [10, 5, 0, 10],
                  },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],
              body: [
                [
                  {
                    text: "Pathogens",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                  { text: "Result", alignment: "center", style: "tableSecVal" },
                  { text: "Remark", alignment: "center", style: "tableSecVal" },
                ],
                [
                  { text: labtestPdf?.pathogen1?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen1?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen1?.remark, style: "tableSecVal" },
                ],
                [
                  { text: labtestPdf?.pathogen2?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen2?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen2?.remark, style: "tableSecVal" },
                ],
                [
                  { text: labtestPdf?.pathogen3?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen3?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen3?.remark, style: "tableSecVal" },
                ],
                [
                  { text: labtestPdf?.pathogen4?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen4?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen4?.remark, style: "tableSecVal" },
                ],
              ],
            },
            layout: {
              fillColor: function (rowIndex: any, node: any, columnIndex: any) {
                return rowIndex === 0 ? "#D7D7D7" : null;
              },

              hLineStyle: function (i: any, node: any) {
                if (i === 0 || i === 1 || i === node.table.body.length) {
                  return null;
                }
                return { dash: { length: 5, space: 2 } };
              },
            },
          },
          {
            text: [
              { text: "Detection Method : ", style: "tableKey" },
              {
                text: lab?.detection_method || "",
                style: "tableKey",
              },
              "\n\n",
              { text: "Comment :  ", style: "tableKey" },
              { text: lab?.comment || "", style: "tableKey" },
            ],
          },
          {
            style: "tableExample",
            margin: [0, 70, 0, 0],
            table: {
              widths: [500],

              body: [
                [
                  {
                    border: [false, false, false, false],
                    text: [],
                  },
                ],
              ],
            },
          },
          {
            text: [
              { text: "หมายเหตุ", style: "tableValue" },
              "\n",
              {
                text: "1. Detected (ผลบวก พบสารพันธุกรรมเชื่อ SARs-CoV-2) เมื่อค่า Ct น้อยกว่า 40",
                style: "tableValue",
              },
              "\n",
              {
                text: "2. Not Detected (ผลลบ ไม่พบสารพันธุกรรมเชื้อ SARs-Cov-2) เมื่อค่า Ct มากกว่าหรือเท่ากับ 40",
                style: "tableValue",
              },
              "\n",
              {
                text: "3. NPS = Nasopharyngeal Swab",
                style: "tableValue",
              },
              "\n",
              //   {
              //     text: "3.1 หากเป็นผู้สัมผัสใกล้ชิดผู้สงสัยสัมผัส แนะนำกักตัว เ4 วัน แยกของใช้ส่วนตัวทุกชนิด เช่น จานช้อน แก้ว ผ้าขนหนู โทรศัพท์ โคยไม่ใช้ร่วมกับผู้อื่น",
              //     style: "tableValue",
              //   },
              //   "\n",
              //   {
              //     text: "3.2 สังเกตอาการตนเอง หากพบอาการผิดปกติน มีใข้ ไอ เจ็บคอ มีน้ำมูก จมูกไม่ไดักลิ่น ลิ้นไม่รับรส หรือมีความเสี่ยงที่จะติดเชื้อ ให้เข้ารับการตรวจด้วยธี RT-PCR",
              //     style: "tableValue",
              //   },
              //   "\n",
              //   {
              //     text: "4. ผู้ติดเชื้อโควิด-19 รายใหม่ ที่ต้องการเข้า ระบบการดูแลที่บ้าน (Home Isolation) สามารถลงทะเบียนทางเว็บ สปสช.สแกน QR Code และ ทางไลน์",
              //     style: "tableValue",
              //   },
              //   "\n",
            ],
            margin: [70, 30, 0, 0],
          },
          {
            alignment: "left",
            absolutePosition: { x: 30, y: 750 },
            text: [
              {
                text: "Reported by : ",
                style: "tableKey",
                margin: [10, 0, 0, 0],
              },
              {
                text: "xxxxxxxxxxxx",
                style: "tableValue",
                margin: [10, 0, 0, 0],
              },
              "\n",
              {
                text: "Approved by : ",
                style: "tableKey",
                margin: [10, 0, 0, 0],
              },
              { text: "xxxxx", style: "tableValue", margin: [10, 0, 0, 0] },
              "\n",
              {
                text: "Report Date : ",
                style: "tableKey",
                margin: [10, 0, 0, 0],
              },
              { text: "xxxxx", style: "tableValue", margin: [10, 0, 0, 0] },
              "\n",
            ],
          },
          {
            alignment: "right",
            absolutePosition: { x: 30, y: 750 },
            text: [
              {
                text: "",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
              {
                text: "",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
              {
                text: "FM 02-001(C)",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
            ],
          },
        ],
      ]);

    // template.footer = {
    //   columns: [
    //     {
    //       alignment: "left",
    //       text: [
    //         {
    //           text: "Reported by : ",
    //           style: "tableKey",
    //           margin: [20, 0, 0, 0],
    //         },
    //         {
    //           text: "xxxxxxxxxxxx",
    //           style: "tableValue",
    //           margin: [20, 0, 0, 0],
    //         },
    //         "\n\n",
    //         {
    //           text: "Approved by : ",
    //           style: "tableKey",
    //           margin: [20, 0, 0, 0],
    //         },
    //         { text: "xxxxx", style: "tableValue", margin: [20, 0, 0, 0] },
    //         "\n\n",
    //         {
    //           text: "Report Date : ",
    //           style: "tableKey",
    //           margin: [20, 0, 0, 0],
    //         },
    //         { text: "xxxxx", style: "tableValue", margin: [20, 0, 0, 0] },
    //         "\n\n",
    //       ],
    //     },
    //     {
    //       alignment: "right",
    //       text: [
    //         {
    //           text: "",
    //           style: "tableKey",
    //           margin: [0, 0, 20, 0],
    //         },
    //         "\n\n",
    //         {
    //           text: "",
    //           style: "tableKey",
    //           margin: [0, 0, 20, 0],
    //         },
    //         "\n\n",
    //         {
    //           text: "FM 02-001(C)",
    //           style: "tableKey",
    //           margin: [0, 0, 20, 0],
    //         },
    //         "\n\n",
    //       ],
    //     },
    //   ],
    // };

    template.styles = {
      header: {
        fontSize: 14,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      tableKey: {
        fontSize: 10,
        bold: true,
      },
      tableValue: {
        fontSize: 10,
      },
      tableSecVal: {
        fontSize: 11,
        bold: true,
        margin: [0, 2, 0, 2],
      },
    };

    // pdfMake.createPdf(template).open();
  } else if (
    lab?.Machine.name ==
    "FM 02-015(B) ใบรายงานผลการทดสอบการตรวจหาสารพันธุกรรมของโรคฝีดาษวานร (Monkeypox Virus)"
  ) {
    template.pageMargins = [20, 20, 20, 20];
    (template.background = function (currentPage, pageSize) {
      return {
        image: logo.base64,
        width: 200,
        height: 200,
        absolutePosition: { x: 200, y: 300 },
        opacity: 0.4,
      };
    }),
      (template.content = [
        [
          {
            alignment: "right",
            absolutePosition: { x: 30, y: 0 },
            text: [
              {
                text: "",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
              {
                text: "",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
              {
                text: "FM 02-015(B)",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
            ],
          },
          {
            columns: [
              {
                image: logo.base64,
                width: 100,
                height: 100,
              },
              {
                text: [
                  {
                    text: "กลุ่มห้องปฏิบัติการสาธารณสุข สถาบันป้องกันควบคุมโรคเขตเมือง ",
                    style: "header",
                  },
                  "\n",
                  {
                    text: "24/56 ม.3 ถนนพหลโยธิน แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพฯ 10220 \nโทรศัพท์ 0 2972 9606, E-MAIL: LABIUDCBKK@GMAIL.COM",
                  },
                ],
                margin: [10, 0, 0, 0],
              },
            ],
          },
          {
            text: "รายงานผลการทดสอบ (Laboratory report)",
            margin: [70, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            text: "การตรวจหาสารพันธุกรรมของโรคฝีดาษวานร (Mokeypox Virus)",
            margin: [90, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],

              body: [
                [
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Name : ", style: "tableKey" },
                      {
                        text:
                          lab?.Patient?.first_name +
                          " " +
                          lab?.Patient?.last_name,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Date of Birth (DOB) : ", style: "tableKey" },
                      {
                        text: convertDateToString(
                          lab?.Patient?.date_of_birth ?? null
                        ),
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Lab No : ", style: "tableKey" },
                      { text: lab?.Patient?.case_no, style: "tableValue" },
                      "\n",
                      { text: "ID Card/Passport : ", style: "tableKey" },
                      { text: lab?.Patient?.id_card, style: "tableValue" },
                      "\n",
                      { text: "Specimens : ", style: "tableKey" },
                      { text: lab?.InspectionType?.name, style: "tableValue" },
                      "\n",
                    ],
                    margin: [0, 5, 0, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Organization : ", style: "tableKey" },
                      {
                        text: lab?.Patient?.age || lab?.Patient?.passport,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Age : ", style: "tableKey" },
                      {
                        text: lab?.Patient?.age || lab?.Patient?.passport,
                        style: "tableValue",
                      },
                      { text: " Years", style: "tableKey" },
                      "\n",
                      { text: "Collected Date : ", style: "tableKey" },
                      {
                        text: convertDateToString(
                          lab?.Patient?.collected_date ?? null
                        ),
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Received Date : ", style: "tableKey" },
                      {
                        text: convertDateToString(
                          lab?.Patient?.received_date ?? null
                        ),
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Reported Date : ", style: "tableKey" },
                      {
                        text: convertDateToString(lab?.report_date ?? null),
                        style: "tableValue",
                      },
                      "\n",
                    ],
                    alignment: "right",
                    margin: [0, 5, 30, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "", style: "tableKey" },
                      { text: "", style: "tableValue" },
                      "\n",
                      { text: "Gender : ", style: "tableKey" },
                      { text: lab?.Patient?.gender, style: "tableValue" },
                      "\n",
                    ],
                    margin: [10, 5, 0, 10],
                  },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],
              body: [
                [
                  {
                    text: "Pathogens",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                  { text: "Result", alignment: "center", style: "tableSecVal" },
                  { text: "Remark", alignment: "center", style: "tableSecVal" },
                ],
                [
                  { text: labtestPdf?.pathogen1?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen1?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen1?.remark, style: "tableSecVal" },
                ],
              ],
            },
            layout: {
              fillColor: function (rowIndex: any, node: any, columnIndex: any) {
                return rowIndex === 0 ? "#D7D7D7" : null;
              },

              hLineStyle: function (i: any, node: any) {
                if (i === 0 || i === 1 || i === node.table.body.length) {
                  return null;
                }
                return { dash: { length: 5, space: 2 } };
              },
            },
          },
          {
            text: [
              {
                text: "Limit od detected (LOD): ชุดน้ำยามี limit of detected ในการตรวจหาเชื้อ Monkeypox Virus ทั้งสองสายพันธุ์เท่ากับ 200 copies/mL",
                style: "tableKey",
              },
              {
                text: lab?.detection_method || "",
                style: "tableKey",
              },
              "\n",
              {
                text: "Limit od detected (LOD): ชุดน้ำยามี limit of detected ในการตรวจหาเชื้อ Monkeypox Virus ทั้งสองสายพันธุ์เท่ากับ 200 copies/mL",
                style: "tableKey",
              },
              "\n\n",
              { text: "Reported By: ", style: "tableKey" },
              { text: lab?.report_by_id || "", style: "tableKey" },
              "\n",
              { text: "Approved By: ", style: "tableKey" },
              { text: lab?.approve_by_id || "", style: "tableKey" },
              "\n\n",
            ],
          },
          {
            style: "tableExample",
            margin: [0, 70, 0, 0],
            table: {
              widths: [500],

              body: [
                [
                  {
                    border: [false, false, false, false],
                    text: [],
                  },
                ],
              ],
            },
          },
          {
            alignment: "left",
            absolutePosition: { x: 30, y: 750 },
            text: [
              {
                text: "การแปรผล",
                style: "tableKey",
                margin: [10, 0, 0, 0],
              },
              "\n",
              {
                text: "- ผล Monkeypox virus; Central African clade detected หมายถึง พบสารพันธุกรรมของโรคฝีดาษวานร สายพันธุ์ Central African",
                style: "tableKey",
                margin: [10, 0, 0, 0],
              },
              "\n",
              {
                text: "- ผล Monkeypox virus; West African clade detected หมายถึง พบสารพันธุกรรมของโรคฝีดาษวานร สายพันธุ์ West African",
                style: "tableKey",
                margin: [10, 0, 0, 0],
              },
              "\n\n",
            ],
          },
        ],
      ]);
    template.styles = {
      header: {
        fontSize: 14,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      tableKey: {
        fontSize: 10,
        bold: true,
      },
      tableValue: {
        fontSize: 10,
      },
      tableSecVal: {
        fontSize: 11,
        bold: true,
        margin: [0, 2, 0, 2],
      },
    };

    // pdfMake.createPdf(template).open();
  } else if (
    lab?.Machine.name ==
    "FM 02-007(A) ใบรายงานผลการทดสอบการตรวจหาสารพันธุกรรมของเชื้อไวรัสและแบคทีเรียก่อโรคในระบบทางเดินหายใจ"
  ) {
    const lab = await prisma.lab.findUnique({
      where: { id },
      include: {
        TestType: true,
        Hospital: true,
        Patient: true,
        Machine: true,
        InspectionType: true,
      },
    });
    if (!lab) throw new ApiError(`Lab with id: ${id} not found.`, 404);

    const labTestList = await prisma.labTest.findMany({
      where: {
        lab_id: lab.id,
      },
      include: {
        Pathogens: true,
      },
    });

    const labtestPdf: LabTestPDFData = {
      pathogen1: {
        name: labTestList[0]?.Pathogens?.name,
        result: labTestList[0]?.result,
        remark: labTestList[0]?.remark,
      },
      pathogen2: {
        name: labTestList[1]?.Pathogens?.name,
        result: labTestList[1]?.result,
        remark: labTestList[1]?.remark,
      },
      pathogen3: {
        name: labTestList[2]?.Pathogens?.name,
        result: labTestList[2]?.result,
        remark: labTestList[2]?.remark,
      },
      pathogen4: {
        name: labTestList[3]?.Pathogens?.name,
        result: labTestList[3]?.result,
        remark: labTestList[3]?.remark,
      },
    };

    const reportBy = await prisma.officer.findUnique({
      where: { id: lab?.report_by_id || 0 },
    });
    const approveBy = await prisma.officer.findUnique({
      where: { id: lab?.approve_by_id || 0 },
    });
    template.pageMargins = [20, 20, 20, 20];
    (template.background = function (currentPage, pageSize) {
      return {
        image: logo.base64,
        width: 200,
        height: 200,
        absolutePosition: { x: 200, y: 300 },
        opacity: 0.4,
      };
    }),
      (template.content = [
        [
          {
            alignment: "right",
            absolutePosition: { x: 30, y: 0 },
            text: [
              {
                text: "",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
              {
                text: "",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
              {
                text: "FM 02-007(A)",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
            ],
          },
          {
            columns: [
              {
                image: logo.base64,
                width: 100,
                height: 100,
              },
              {
                text: [
                  {
                    text: "กลุ่มห้องปฏิบัติการทางการแพทย์ด้านการควบคุมโรค สถาบันป้องกันควบคุมโรคเขตเมือง ",
                    style: "header",
                  },
                  "\n\n",
                  {
                    text: "24/56 ม.3 ถนนพหลโยธิน แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพฯ 10220 \nโทรศัพท์ 0 2972 9606, E-MAIL: LABIUDCBKK@GMAIL.COM",
                  },
                ],
                margin: [10, 0, 0, 0],
              },
            ],
          },
          {
            text: "รายงานผลการทดสอบ (Laboratory report)",
            margin: [70, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            text: "การตรวจหาสารพันธุกรรมของเชื้อไวรัสและแบคทีเรียก่อโรคในระบบทางเดินหายใจ",
            margin: [90, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [127.5, 128, 127.5, 127],

              body: [
                [
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Name : ", style: "tableKey" },
                      {
                        text:
                          lab?.Patient?.first_name +
                          " " +
                          lab?.Patient?.last_name,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Organization : ", style: "tableKey" },
                      { text: "", style: "tableValue" },
                      "\n",
                      { text: "Specimens : ", style: "tableKey" },
                      { text: lab?.InspectionType?.name, style: "tableValue" },
                    ],
                    margin: [0, 5, 0, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "AGE : ", style: "tableKey" },
                      { text: lab?.Patient?.age, style: "tableValue" },
                      { text: " Years", style: "tableKey" },
                      "\n",
                      { text: "Collected Date: ", style: "tableKey" },
                      {
                        text:
                          convertDateToString(
                            lab?.Patient?.collected_date ?? null
                          ) +
                          " " +
                          lab?.Patient?.collected_time,
                        style: "tableValue",
                      },
                      "\n",
                    ],
                    alignment: "right",
                    margin: [0, 5, 30, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "HN : ", style: "tableKey" },
                      { text: lab?.Patient?.hn, style: "tableValue" },
                      "\n",
                      { text: "Recevied Date : ", style: "tableKey" },
                      {
                        text:
                          convertDateToString(
                            lab?.Patient?.received_date ?? null
                          ) +
                          " " +
                          lab?.Patient?.received_time,
                        style: "tableValue",
                      },
                    ],
                    margin: [10, 5, 0, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Lab No. ", style: "tableKey" },
                      { text: lab?.Patient?.case_no, style: "tableValue" },
                    ],
                    alignment: "right",
                    margin: [10, 5, 30, 10],
                  },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],
              body: [
                [
                  {
                    text: "Pathogens",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                  {
                    text: "Result",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                  {
                    text: "Ct.value",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen1?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen1?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen1?.remark,
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen2?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen2?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen2?.remark,
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen3?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen3?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen3?.remark,
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen4?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen4?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen4?.remark,
                    style: "tableSecVal",
                  },
                ],
              ],
            },
            layout: {
              fillColor: function (rowIndex: any, node: any, columnIndex: any) {
                return rowIndex === 0 ? "#D7D7D7" : null;
              },

              hLineStyle: function (i: any, node: any) {
                if (i === 0 || i === 1 || i === node.table.body.length) {
                  return null;
                }
                return { dash: { length: 5, space: 2 } };
              },
            },
          },
          {
            text: [
              { text: "Detection Method : ", style: "tableKey" },
              {
                text: lab?.detection_method || "",
                style: "tableValue",
              },
              "\n\n",
              { text: "COMMENT :  ", style: "tableValue" },
              { text: lab?.comment || "", style: "tableValue" },
            ],
          },
          {
            style: "tableExample",
            margin: [0, 70, 0, 0],
            table: {
              widths: [250, 280], // Adjust widths as necessary
              body: [
                [
                  {
                    border: [false, true, false, false],
                    text: [
                      {
                        text: "Reported by ............................................................",
                        style: "tableKey",
                      },
                      "\n",
                      {
                        text: reportBy?.first_name + " " + reportBy?.last_name,
                        style: "tableValue",
                        margin: [10, 10, 10, 10],
                      },
                      "\n",
                      {
                        text: "Date ............................................................",
                        style: "tableKey",
                      },
                    ],
                    alignment: 'center'
                  },
                  {
                    border: [false, true, false, false],
                    text: [
                      {
                        text: "Approved by ............................................................",
                        style: "tableKey",
                      },
                      "\n",
                      {
                        text:
                        approveBy?.first_name + " " + approveBy?.last_name,
                        style: "tableValue",
                      },
                      "\n",
                      {
                        text: "Date ............................................................",
                        style: "tableKey",
                      },
                    ],
                    alignment: 'center'
                  },
                ],
              ],
            },
          },
        ],
      ]);

    template.styles = {
      header: {
        fontSize: 14,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      tableKey: {
        fontSize: 10,
        bold: true,
      },
      tableValue: {
        fontSize: 10,
      },
      tableSecVal: {
        fontSize: 11,
        bold: true,
        margin: [0, 2, 0, 2],
      },
    };

    // pdfMake.createPdf(template).open();
    return new Promise((resolve, reject) => {
      try {
        const doc = pdfMake.createPdf(template);
        doc.getBuffer(async function (buffer) {
          resolve(buffer);
        });
      } catch (e) {
        reject("Error pdfMake.createPdf()");
      }
    });
  } else if (lab?.Machine.name === "FM 02-000(A) แบบฟอร์มการรายงานผล IGRA") {
    const lab = await prisma.lab.findUnique({
      where: { id },
      include: {
        TestType: true,
        Hospital: true,
        Patient: true,
        Machine: true,
        InspectionType: true,
      },
    });
    if (!lab) throw new ApiError(`Lab with id: ${id} not found.`, 404);
    const labTestList = await prisma.labTest.findMany({
      where: {
        lab_id: lab.id,
      },
      include: {
        Pathogens: true,
      },
    });
    const labtestPdf = {
      pathogen1: {
        name: labTestList[0]?.Pathogens?.name,
        result: labTestList[0]?.result,
        remark: labTestList[0]?.remark,
      },
      pathogen2: {
        name: labTestList[1]?.Pathogens?.name,
        result: labTestList[1]?.result,
        remark: labTestList[1]?.remark,
      },
      pathogen3: {
        name: labTestList[2]?.Pathogens?.name,
        result: labTestList[2]?.result,
        remark: labTestList[2]?.remark,
      },
      pathogen4: {
        name: labTestList[3]?.Pathogens?.name,
        result: labTestList[3]?.result,
        remark: labTestList[3]?.remark,
      },
    };
    const reportBy = await prisma.officer.findUnique({
      where: { id: lab?.report_by_id || 0 },
    });
    const approveBy = await prisma.officer.findUnique({
      where: { id: lab?.approve_by_id || 0 },
    });
    template.pageMargins = [20, 20, 20, 20];
    template.background = function (currentPage, pageSize) {
      return {
        image: logo.base64,
        width: 200,
        height: 200,
        absolutePosition: { x: 200, y: 300 },
        opacity: 0.4,
      };
    };
    template.content = [
      [
        {
          alignment: "right",
          absolutePosition: { x: 30, y: 0 },
          text: [
            {
              text: "",
              style: "tableKey",
              margin: [0, 0, 20, 0],
            },
            "\n",
            {
              text: "",
              style: "tableKey",
              margin: [0, 0, 20, 0],
            },
            "\n",
            {
              text: "FM 02-000(A)",
              style: "tableKey",
              margin: [0, 0, 20, 0],
            },
            "\n",
          ],
        },
        {
          columns: [
            {
              image: logo.base64,
              width: 100,
              height: 100,
            },
            {
              text: [
                {
                  text: "กลุ่มห้องปฏิบัติการทางการแพทย์ด้านการควบคุมโรค สถาบันป้องกันควบคุมโรคเขตเมือง ",
                  style: "header",
                },
                "\n\n",
                {
                  text: "24/56 ม.3 ถนนพหลโยธิน แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพฯ 10220 \nโทรศัพท์ 0 2972 9606, E-MAIL: LABIUDCBKK@GMAIL.COM",
                },
              ],
              margin: [10, 0, 0, 0],
            },
          ],
        },
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: "รายงานผลการทดสอบ (Laboratory report)",
                  margin: [70, 0, 0, 0],
                  alignment: "center",
                  style: "subheader",
                  border: [false, true, false, false], // Adds a top border
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 1 : 0;
            },
            vLineWidth: function (i) {
              return 0;
            },
            hLineColor: function (i) {
              return "black";
            },
          },
        },
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: "การตรวจการติดเชื้อวัณโรคระยะแฝงด้วยวิธี Interfer Gamma Release Assay (IGRAs)",
                  margin: [90, 0, 0, 0],
                  alignment: "center",
                  style: "subheader",
                  border: [false, false, false, false], // Adds a top border
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 1 : 0;
            },
            vLineWidth: function (i) {
              return 0;
            },
            hLineColor: function (i) {
              return "black";
            },
          },
        },
        {
          style: "tableExample",
          margin: [0, 15, 0, 0],
          table: {
            widths: [170, 170, 170],
            body: [
              [
                {
                  border: [false, false, false, false],
                  text: [
                    { text: "Name : ", style: "tableKey" },
                    {
                      text:
                        lab?.Patient?.first_name +
                        " " +
                        lab?.Patient?.last_name,
                      style: "tableValue",
                    },
                    "\n",
                    { text: "Date of Birth (DOB) : ", style: "tableKey" },
                    {
                      text: convertDateToString(
                        lab?.Patient?.date_of_birth ?? null
                      ),
                      style: "tableValue",
                    },
                    "\n",
                    { text: "Lab NO. ", style: "tableKey" },
                    { text: lab?.Patient?.case_no, style: "tableValue" },
                    "\n",
                    { text: "ID Card/Passport :", style: "tableKey" },
                    { text: lab?.Patient?.id_card, style: "tableValue" },
                    "\n",
                    { text: "Specimens :", style: "tableKey" },
                    { text: lab?.InspectionType?.name, style: "tableValue" },
                    "\n",
                  ],
                  margin: [0, 5, 0, 10],
                },
                {
                  border: [false, false, false, false],
                  text: [
                    { text: "Organization : ", style: "tableKey" },
                    { text: "", style: "tableValue" },
                    "\n",
                    { text: "Age: ", style: "tableKey" },
                    { text: lab?.Patient?.age, style: "tableValue" },
                    { text: " Years", style: "tableValue" },
                    "\n",
                    { text: "Corrected Date: ", style: "tableKey" },
                    {
                      text: convertDateToString(
                        lab?.Patient?.collected_date ?? null
                      ),
                      style: "tableValue",
                    },
                    "\n",
                    { text: "Received Date: ", style: "tableKey" },
                    {
                      text: convertDateToString(
                        lab?.Patient?.received_date ?? null
                      ),
                      style: "tableValue",
                    },
                    "\n",
                  ],
                  alignment: "right",
                  margin: [0, 5, 30, 10],
                },
                {
                  border: [false, false, false, false],
                  text: [
                    { text: "", style: "tableKey" },
                    "\n",
                    {
                      text: lab?.Patient?.collected_time,
                      style: "tableValue",
                    },
                    { text: "Gender :", style: "tableKey" },
                    { text: lab?.Patient?.gender, style: "tableValue" },
                    "\n",
                    { text: "Time :", style: "tableValue" },
                    { text: lab?.Patient?.collected_time, style: "tableValue" },
                    "\n",
                    { text: "Time :", style: "tableValue" },
                    {
                      text: lab?.Patient?.received_time,
                      style: "tableValue",
                    },
                  ],
                  margin: [10, 5, 0, 10],
                },
              ],
            ],
          },
        },
        {
          style: "tableExample",
          margin: [0, 15, 0, 0],
          table: {
            widths: [170, 170, 170],
            body: [
              [
                {
                  text: "QuantiFERON-TB Result",
                  alignment: "center",
                  style: "tableSecVal",
                },
                {
                  text: "Remark (IU/ml)",
                  alignment: "center",
                  style: "tableSecVal",
                },
                {
                  text: "Interpretation",
                  alignment: "center",
                  style: "tableSecVal",
                },
              ],
              [
                {
                  text: "INDETERMINATE",
                  alignment: "center",
                  style: "tableSecVal",
                },
                {
                  text: labtestPdf?.pathogen1?.result,
                  alignment: "center",
                  style: "tableSecVal",
                },
                {
                  text: labtestPdf?.pathogen1?.remark,
                  style: "tableSecVal",
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? "#D7D7D7" : null;
            },
            hLineStyle: function (i, node) {
              if (i === 0 || i === 1 || i === node.table.body.length) {
                return null;
              }
              return { dash: { length: 5, space: 2 } };
            },
          },
        },
        {
          text: [
            "\n",
            { text: "Detection Method : ", style: "tableKey" },
            {
              text: lab?.detection_method || "",
              style: "tableValue",
            },
          ],
        },
        {
          style: "tableExample",
          margin: [0, 70, 0, 0],
          table: {
            widths: [530], // Adjust widths as necessary
            body: [
              [
                {
                  border: [false, true, false, false],
                  text: [
                    {
                      text: "หมายเหตุ (ค่าอ้างอิงการรายงานผล)",
                      style: "tableKey",
                    },
                    "\n",
                  ],
                },
              ],
            ],
          },
        },
        {
          style: "tableExample",
          margin: [0, 15, 0, 0],
          table: {
            widths: [50, 80, 80, 100, 70, 110],
            body: [
              [
                {
                  border: [true, true, true, true],
                  text: "Nil (IU/ml)",
                  style: "tableKey",
                  margin: [0, 2, 0, 2],
                },
                {
                  border: [true, true, true, true],
                  text: "TB1-Nil(IU/ml)",
                  style: "tableKey",
                  alignment: "right",
                  margin: [0, 2, 30, 2],
                },
                {
                  border: [true, true, true, true],
                  text: "TB2-Nil(IU/ml)",
                  style: "tableKey",
                  margin: [10, 2, 0, 2],
                },
                {
                  border: [true, true, true, true],
                  text: "Mitogen-Nil(IU/ml)",
                  style: "tableKey",
                  margin: [10, 2, 30, 2],
                },
                {
                  border: [true, true, true, true],
                  text: "QFT-Plus Result",
                  style: "tableKey",
                  margin: [10, 2, 0, 2],
                },
                {
                  border: [true, true, true, true],
                  text: "Report/Interpretation",
                  style: "tableKey",
                  margin: [10, 2, 30, 2],
                },
              ],
              [
                {
                  text: "≥ 0.35 and\n≥ 25% of Nil value",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "Any",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "Any",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "Any",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "Positive",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "M. tuberculosis infection likely",
                  margin: [0, 2, 0, 2],
                },
              ],
              [
                {
                  text: "≤ 8.0\n< 0.35 or ≥ 0.35 and\n< 25% of Nil value",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "≥ 0.35 and\n≥ 25% of Nil value",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "< 0.35 or ≥ 0.35 and\n< 25% of Nil value",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "≥ 0.5",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "Negative",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "M. tuberculosis infection NOT likely",
                  margin: [0, 2, 0, 2],
                },
              ],
              [
                {
                  text: "≤ 8.0\n< 0.35 or ≥ 0.35 and\n< 25% of Nil value",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "< 0.35 or ≥ 0.35 and\n< 25% of Nil value",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "< 0.35 or ≥ 0.35 and\n< 25% of Nil value",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "< 0.5",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "Indeterminate",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "Likelihood of M. tuberculosis infection cannot be determined",
                  margin: [0, 2, 0, 2],
                },
              ],
              [
                {
                  text: "> 8.0",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "Any",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "Any",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "Any",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "",
                  margin: [0, 2, 0, 2],
                },
                {
                  text: "",
                  margin: [0, 2, 0, 2],
                },
              ],
            ],
          },
        },
      ],
      {
        style: "tableExample",
        margin: [0, 15, 0, 0],
        table: {
          widths: [220, 220],
          body: [
            [
              {
                border: [false, false, false, false],
                text: [
                  { text: "Reported By : ", style: "tableKey" },
                  { text: lab?.report_by_id, style: "tableValue" },
                  "\n",
                  { text: "Approved By: ", style: "tableKey" },
                  {
                    text: convertDateToString(
                      lab?.Patient?.date_of_birth ?? null
                    ),
                    style: "tableValue",
                  },
                ],
                margin: [0, 5, 0, 10],
              },
              {
                border: [false, false, false, false],
                text: [
                  { text: "Reported Date : ", style: "tableKey" },
                  {
                    text: convertDateToString(
                      lab?.Patient?.received_date ?? null
                    ),
                    style: "tableValue",
                  },
                  "\n",
                  { text: "Approved Date: ", style: "tableKey" },
                  {
                    text: lab?.Patient?.age,
                    style: "tableValue",
                  },
                  {
                    text: convertDateToString(lab?.approve_date ?? null),
                    style: "tableValue",
                  },
                ],
                alignment: "right",
                margin: [0, 5, 30, 10],
              },
            ],
          ],
        },
      },
    ];
    template.styles = {
      header: {
        fontSize: 14,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      tableKey: {
        fontSize: 10,
        bold: true,
      },
      tableValue: {
        fontSize: 10,
      },
      tableSecVal: {
        fontSize: 11,
        bold: true,
        margin: [0, 2, 0, 2],
      },
    };
  } else if (lab?.Machine.name === "FM 02-005(A) ใบรายงานผลตรวจทางภูมิคุ้มกันวิทยา") {
    template.pageMargins = [20, 20, 20, 20];
    (template.background = function (currentPage, pageSize) {
      return {
        image: logo.base64,
        width: 200,
        height: 200,
        absolutePosition: { x: 200, y: 300 },
        opacity: 0.4,
      };
    }),
      (template.content = [
        [
          {
            columns: [
              {
                image: logo.base64,
                width: 100,
                height: 100,
              },
              {
                text: [
                  {
                    text: "Public Health Laboratory, Institute for Urban Disease Control and Prevention ",
                    style: "header",
                  },
                  "\n\n",
                  {
                    text: "24/56 Phahonynthin Rd, Anusawari, Rang-khen. Rangknk 10770 \nTel +66 2972 9606, +66 96 0966075, E-mail: labiudcbkk@gmail.com",
                  },
                ],
                margin: [10, 0, 0, 0],
              },
            ],
          },
          {
            style: "tableExample",
            margin: [0, 0, 0, 0],
            table: {
              widths: [170, 170, 170],

              body: [
                [
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Name : ", style: "tableKey" },
                      {
                        text:
                          lab?.Patient?.first_name +
                          " " +
                          lab?.Patient?.last_name,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Age : ", style: "tableKey" },
                      { text: lab?.Patient?.age, style: "tableValue" },
                      "\n",
                      { text: "Sex : ", style: "tableKey" },
                      { text: "", style: "tableValue" },
                    ],
                    margin: [0, 5, 0, 5],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "HN : ", style: "tableKey" },
                      { text: lab?.id, style: "tableValue" },
                      "\n",
                      { text: "Request By : ", style: "tableKey" },
                      { text: lab?.Patient?.gender, style: "tableValue" },
                      "\n",
                      { text: "Receive By : ", style: "tableKey" },
                      { text: lab?.Patient?.gender, style: "tableValue" },
                      "\n",
                    ],
                    alignment: "right",
                    margin: [0, 5, 30, 5],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Order Department", style: "tableKey" },
                      { text: "", style: "tableValue" },
                      "\n",
                      { text: "Vist Type : ", style: "tableKey" },
                      { text: lab?.Patient?.id_card, style: "tableValue" },
                      "\n",
                      { text: "Receive Time : ", style: "tableKey" },
                      { text: lab?.Patient?.id_card, style: "tableValue" },
                    ],
                    margin: [10, 5, 0, 5],
                  },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [127.5, 127.5, 127.5, 127.5],
              body: [
                [
                  {
                    text: "Parameter",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                  { text: "Result", alignment: "center", style: "tableSecVal" },
                  { text: "Reference", alignment: "center", style: "tableSecVal" },
                  { text: "Method", alignment: "center", style: "tableSecVal" },
                ],
                [
                  { text: labtestPdf?.pathogen1?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen1?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen1?.remark, style: "tableSecVal" },
                  { text: "", style: "tableSecVal" },  // Added this line
                ],
                [
                  { text: labtestPdf?.pathogen2?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen2?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen2?.remark, style: "tableSecVal" },
                  { text: "", style: "tableSecVal" },  // Added this line
                ],
                [
                  { text: labtestPdf?.pathogen3?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen3?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen3?.remark, style: "tableSecVal" },
                  { text: "", style: "tableSecVal" },  // Added this line
                ],
                [
                  { text: labtestPdf?.pathogen4?.name, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen4?.result, style: "tableSecVal" },
                  { text: labtestPdf?.pathogen4?.remark, style: "tableSecVal" },
                  { text: "", style: "tableSecVal" },  // Added this line
                ],
              ],
            },
            layout: {
              fillColor: function (rowIndex, node, columnIndex) {
                return rowIndex === 0 ? "#D7D7D7" : null;
              },
              hLineStyle: function (i, node) {
                if (i === 0 || i === 1 || i === node.table.body.length) {
                  return null;
                }
                return { dash: { length: 5, space: 2 } };
              },
            },
          },
          {
            text: [
              { text: "Result: ", style: "tableKey" },
              {
                text: lab?.result || "",
                style: "tableKey",
              },
              "\n\n",
              { text: "Reference :  ", style: "tableKey" },
              { text: "", style: "tableKey" },
              "\n\n",
              { text: "Method :  ", style: "tableKey" },
              { text: lab?.TestType?.subfix_name || "", style: "tableKey" },
            ],
          },             
          {
            style: "tableExample",
            margin: [0, 70, 0, 0],
            table: {
              widths: [500],

              body: [
                [
                  {
                    border: [false, false, false, false],
                    text: [],
                  },
                ],
              ],
            },
          },
          {
            text: [
              { text: "หมายเหตุ", style: "tableValue" },
              "\n",
              {
                text: "1. Detected (ผลบวก พบสารพันธุกรรมเชื่อ SARs-CoV-2) เมื่อค่า Ct น้อยกว่า 40",
                style: "tableValue",
              },
              "\n",
              {
                text: "2. Not Detected (ผลลบ ไม่พบสารพันธุกรรมเชื้อ SARs-Cov-2) เมื่อค่า Ct มากกว่าหรือเท่ากับ 40",
                style: "tableValue",
              },
              "\n",
              {
                text: "3. NPS = Nasopharyngeal Swab",
                style: "tableValue",
              },
              "\n",
              //   {
              //     text: "3.1 หากเป็นผู้สัมผัสใกล้ชิดผู้สงสัยสัมผัส แนะนำกักตัว เ4 วัน แยกของใช้ส่วนตัวทุกชนิด เช่น จานช้อน แก้ว ผ้าขนหนู โทรศัพท์ โคยไม่ใช้ร่วมกับผู้อื่น",
              //     style: "tableValue",
              //   },
              //   "\n",
              //   {
              //     text: "3.2 สังเกตอาการตนเอง หากพบอาการผิดปกติน มีใข้ ไอ เจ็บคอ มีน้ำมูก จมูกไม่ไดักลิ่น ลิ้นไม่รับรส หรือมีความเสี่ยงที่จะติดเชื้อ ให้เข้ารับการตรวจด้วยธี RT-PCR",
              //     style: "tableValue",
              //   },
              //   "\n",
              //   {
              //     text: "4. ผู้ติดเชื้อโควิด-19 รายใหม่ ที่ต้องการเข้า ระบบการดูแลที่บ้าน (Home Isolation) สามารถลงทะเบียนทางเว็บ สปสช.สแกน QR Code และ ทางไลน์",
              //     style: "tableValue",
              //   },
              //   "\n",
            ],
            margin: [70, 30, 0, 0],
          },
          {
            alignment: "left",
            absolutePosition: { x: 30, y: 750 },
            text: [
              {
                text: "Reported by : ",
                style: "tableKey",
                margin: [10, 0, 0, 0],
              },
              {
                text: "xxxxxxxxxxxx",
                style: "tableValue",
                margin: [10, 0, 0, 0],
              },
              "\n",
              {
                text: "Approved by : ",
                style: "tableKey",
                margin: [10, 0, 0, 0],
              },
              { text: "xxxxx", style: "tableValue", margin: [10, 0, 0, 0] },
              "\n",
              {
                text: "Report Date : ",
                style: "tableKey",
                margin: [10, 0, 0, 0],
              },
              { text: "xxxxx", style: "tableValue", margin: [10, 0, 0, 0] },
              "\n",
            ],
          },
          {
            alignment: "right",
            absolutePosition: { x: 30, y: 0 },
            text: [
              {
                text: "",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
              {
                text: "",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
              {
                text: "FM 02-005(A)",
                style: "tableKey",
                margin: [0, 0, 20, 0],
              },
              "\n",
            ],
          },
        ],
      ]);

    template.styles = {
      header: {
        fontSize: 14,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      tableKey: {
        fontSize: 10,
        bold: true,
      },
      tableValue: {
        fontSize: 10,
      },
      tableSecVal: {
        fontSize: 11,
        bold: true,
        margin: [0, 2, 0, 2],
      },
    };
  }
  return new Promise((resolve, reject) => {
    try {
      const doc = pdfMake.createPdf(template);
      doc.getBuffer(async function (buffer) {
        resolve(buffer);
      });
    } catch (e) {
      reject("Error pdfMake.createPdf()");
    }
  });
}

export async function PDFLAB(id: number): Promise<Buffer> {
  const lab = await prisma.lab.findUnique({
    where: { id },
    include: {
      TestType: true,
      Hospital: true,
      Patient: true,
      Machine: true,
      InspectionType: true,
    },
  });
  if (!lab) throw new ApiError(`Lab with id: ${id} not found.`, 404);

  const labTestList = await prisma.labTest.findMany({
    where: {
      lab_id: lab.id,
    },
    include: {
      Pathogens: true,
    },
  });

  const labtestPdf: LabTestPDFData = {
    pathogen1: {
      name: labTestList[0]?.Pathogens?.name,
      result: labTestList[0]?.result,
      remark: labTestList[0]?.remark,
    },
    pathogen2: {
      name: labTestList[1]?.Pathogens?.name,
      result: labTestList[1]?.result,
      remark: labTestList[1]?.remark,
    },
    pathogen3: {
      name: labTestList[2]?.Pathogens?.name,
      result: labTestList[2]?.result,
      remark: labTestList[2]?.remark,
    },
    pathogen4: {
      name: labTestList[3]?.Pathogens?.name,
      result: labTestList[3]?.result,
      remark: labTestList[3]?.remark,
    },
  };

  const reportBy = await prisma.officer.findUnique({
    where: { id: lab?.report_by_id || 0 },
  });
  const approveBy = await prisma.officer.findUnique({
    where: { id: lab?.approve_by_id || 0 },
  });

  if (lab?.Machine?.name !== "FM 02-000(A)") {
    template.pageMargins = [20, 20, 20, 20];
    (template.background = function (currentPage, pageSize) {
      return {
        image: logo.base64,
        width: 200,
        height: 200,
        absolutePosition: { x: 200, y: 300 },
        opacity: 0.4,
      };
    }),
      (template.content = [
        [
          {
            columns: [
              {
                image: logo.base64,
                width: 100,
                height: 100,
              },
              {
                text: [
                  {
                    text: "กลุ่มห้องปฏิบัติการสาธารณสุข สถาบันป้องกันควบคุมโรคเขตเมือง ",
                    style: "header",
                  },
                  "\n\n",
                  {
                    text: "24/56 ม.3 ถนนพหลโยธิน แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพฯ 10220 \nโทรศัพท์ 0 2972 9606, E-MAIL: LABIUDCBKK@GMAIL.COM",
                  },
                ],
                margin: [10, 0, 0, 0],
              },
            ],
          },
          {
            text: "รายงานผลการทดสอบ (Laboratory report)",
            margin: [70, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            text: lab?.Machine?.code,
            margin: [90, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],

              body: [
                [
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Name : ", style: "tableKey" },
                      {
                        text:
                          lab?.Patient?.first_name +
                          " " +
                          lab?.Patient?.last_name,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Lab No : ", style: "tableKey" },
                      { text: lab?.case_no, style: "tableValue" },
                      "\n",
                      { text: "ID Card / PASSPORT : ", style: "tableKey" },
                      { text: lab?.Patient?.id_card, style: "tableValue" },
                      "\n",
                      { text: "Organization : ", style: "tableKey" },
                      { text: lab?.Hospital?.name, style: "tableValue" },
                      "\n",
                      { text: "Specimens : ", style: "tableKey" },
                      { text: lab?.InspectionType?.name, style: "tableValue" },
                      "\n",
                    ],
                    margin: [0, 5, 0, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "AGE : ", style: "tableKey" },
                      { text: lab?.Patient?.age, style: "tableValue" },
                      "\n",
                      { text: "SAT ID : ", style: "tableKey" },
                      { text: lab?.Patient?.sat_id, style: "tableValue" },
                      "\n",
                    ],
                    alignment: "right",
                    margin: [0, 5, 30, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Sex : ", style: "tableKey" },
                      { text: lab?.Patient?.gender, style: "tableValue" },
                      "\n",
                      { text: "HN : ", style: "tableKey" },
                      { text: lab?.Patient?.hn, style: "tableValue" },
                      "\n",
                      { text: "Collect Date : ", style: "tableKey" },
                      {
                        text:
                          convertDateToString(
                            lab?.Patient?.collected_date ?? null
                          ) +
                          " " +
                          lab?.Patient?.collected_time,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Received Date : ", style: "tableKey" },
                      {
                        text:
                          convertDateToString(
                            lab?.Patient?.received_date ?? null
                          ) +
                          " " +
                          lab?.Patient?.received_time,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Report Date : ", style: "tableKey" },
                      {
                        text: convertDateToStringWithTime(
                          lab?.created_at ?? null
                        ),
                        style: "tableValue",
                      },
                      "\n",
                    ],
                    margin: [10, 5, 0, 10],
                  },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],
              body: [
                [
                  {
                    text: "Pathogens",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                  {
                    text: "Result",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                  {
                    text: "Remark",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen1?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen1?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen1?.remark,
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen2?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen2?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen2?.remark,
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen3?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen3?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen3?.remark,
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen4?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen4?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen4?.remark,
                    style: "tableSecVal",
                  },
                ],
              ],
            },
            layout: {
              fillColor: function (rowIndex: any, node: any, columnIndex: any) {
                return rowIndex === 0 ? "#D7D7D7" : null;
              },

              hLineStyle: function (i: any, node: any) {
                if (i === 0 || i === 1 || i === node.table.body.length) {
                  return null;
                }
                return { dash: { length: 5, space: 2 } };
              },
            },
          },
          {
            text: [
              { text: "Detection Method : ", style: "tableKey" },
              {
                text: lab?.detection_method || "",
                style: "tableValue",
              },
              "\n\n",
              { text: "COMMENT :  ", style: "tableValue" },
              { text: lab?.comment || "", style: "tableValue" },
            ],
          },
          {
            style: "tableExample",
            margin: [0, 70, 0, 0],
            table: {
              widths: [500],

              body: [
                [
                  {
                    border: [false, true, false, false],
                    text: [],
                  },
                ],
              ],
            },
          },
          {
            text: [
              { text: "Reported by : ", style: "tableKey" },
              {
                text: reportBy?.first_name + " " + reportBy?.last_name,
                style: "tableValue",
              },
              "\n\n",
              { text: "Approved by : ", style: "tableKey" },
              {
                text:
                  approveBy?.first_name +
                  " " +
                  reportBy?.last_name +
                  " " +
                  lab?.approve_time,
                style: "tableValue",
              },
            ],
          },
          {
            text: [
              { text: "remark", style: "tableValue" },
              "\n",
              {
                text: "1. ใบรายงานผล รองรับเฉพาะตัวอย่างที่ใด้รับการทตสอบในครั้งนี้เท่านั้น",
                style: "tableValue",
              },
              "\n",
              {
                text: "2. ผล Positive ให้ทำการตรวจยืนยันด้วยวิชี RT -PCR และให้กลับไปกักตัวที่บ้านจนกว่าจะทราบผลการตรวจ RT-PCR",
                style: "tableValue",
              },
              "\n",
              {
                text: "3. ผa Negative : ไม่พบเชื้อ",
                style: "tableValue",
              },
              "\n",
              {
                text: "3.1 หากเป็นผู้สัมผัสใกล้ชิดผู้สงสัยสัมผัส แนะนำกักตัว เ4 วัน แยกของใช้ส่วนตัวทุกชนิด เช่น จานช้อน แก้ว ผ้าขนหนู โทรศัพท์ โคยไม่ใช้ร่วมกับผู้อื่น",
                style: "tableValue",
              },
              "\n",
              {
                text: "3.2 สังเกตอาการตนเอง หากพบอาการผิดปกติน มีใข้ ไอ เจ็บคอ มีน้ำมูก จมูกไม่ไดักลิ่น ลิ้นไม่รับรส หรือมีความเสี่ยงที่จะติดเชื้อ ให้เข้ารับการตรวจด้วยธี RT-PCR",
                style: "tableValue",
              },
              "\n",
              {
                text: "4. ผู้ติดเชื้อโควิด-19 รายใหม่ ที่ต้องการเข้า ระบบการดูแลที่บ้าน (Home Isolation) สามารถลงทะเบียนทางเว็บ สปสช.สแกน QR Code และ ทางไลน์",
                style: "tableValue",
              },
              "\n",
            ],
            margin: [70, 30, 0, 0],
          },
        ],
      ]);

    template.styles = {
      header: {
        fontSize: 14,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      tableKey: {
        fontSize: 10,
        bold: true,
      },
      tableValue: {
        fontSize: 10,
      },
      tableSecVal: {
        fontSize: 11,
        bold: true,
        margin: [0, 2, 0, 2],
      },
    };

    // pdfMake.createPdf(template).open();
    return new Promise((resolve, reject) => {
      try {
        const doc = pdfMake.createPdf(template);
        doc.getBuffer(async function (buffer) {
          resolve(buffer);
        });
      } catch (e) {
        reject("Error pdfMake.createPdf()");
      }
    });
  } else {
    template.pageMargins = [20, 20, 20, 20];
    (template.background = function (currentPage, pageSize) {
      return {
        image: logo.base64,
        width: 200,
        height: 200,
        absolutePosition: { x: 200, y: 300 },
        opacity: 0.4,
      };
    }),
      (template.content = [
        [
          {
            columns: [
              {
                image: logo.base64,
                width: 100,
                height: 100,
              },
              {
                text: [
                  {
                    text: "กลุ่มห้องปฏิบัติการสาธารณสุข สถาบันป้องกันควบคุมโรคเขตเมือง ",
                    style: "header",
                  },
                  "\n\n",
                  {
                    text: "24/56 ม.3 ถนนพหลโยธิน แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพฯ 10220 \nโทรศัพท์ 0 2972 9606, E-MAIL: LABIUDCBKK@GMAIL.COM",
                  },
                ],
                margin: [10, 0, 0, 0],
              },
            ],
          },
          {
            text: "รายงานผลการทดสอบ (Laboratory report)",
            margin: [70, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            text: lab?.Machine?.code,
            margin: [90, 0, 0, 0],
            alignment: "center",
            style: "subheader",
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],

              body: [
                [
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Name : ", style: "tableKey" },
                      {
                        text:
                          lab?.Patient?.first_name +
                          " " +
                          lab?.Patient?.last_name,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Lab No : ", style: "tableKey" },
                      { text: lab?.case_no, style: "tableValue" },
                      "\n",
                      { text: "ID Card / PASSPORT : ", style: "tableKey" },
                      { text: lab?.Patient?.id_card, style: "tableValue" },
                      "\n",
                      { text: "Organization : ", style: "tableKey" },
                      { text: lab?.Hospital?.name, style: "tableValue" },
                      "\n",
                      { text: "Specimens : ", style: "tableKey" },
                      { text: lab?.InspectionType?.name, style: "tableValue" },
                      "\n",
                    ],
                    margin: [0, 5, 0, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "AGE : ", style: "tableKey" },
                      { text: lab?.Patient?.age, style: "tableValue" },
                      "\n",
                      { text: "SAT ID : ", style: "tableKey" },
                      { text: lab?.Patient?.sat_id, style: "tableValue" },
                      "\n",
                    ],
                    alignment: "right",
                    margin: [0, 5, 30, 10],
                  },
                  {
                    border: [false, true, false, true],
                    text: [
                      { text: "Sex : ", style: "tableKey" },
                      { text: lab?.Patient?.gender, style: "tableValue" },
                      "\n",
                      { text: "HN : ", style: "tableKey" },
                      { text: lab?.Patient?.hn, style: "tableValue" },
                      "\n",
                      { text: "Collect Date : ", style: "tableKey" },
                      {
                        text:
                          convertDateToString(
                            lab?.Patient?.collected_date ?? null
                          ) +
                          " " +
                          lab?.Patient?.collected_time,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Received Date : ", style: "tableKey" },
                      {
                        text:
                          convertDateToString(
                            lab?.Patient?.received_date ?? null
                          ) +
                          " " +
                          lab?.Patient?.received_time,
                        style: "tableValue",
                      },
                      "\n",
                      { text: "Report Date : ", style: "tableKey" },
                      {
                        text: convertDateToStringWithTime(
                          lab?.report_date ?? null
                        ),
                        style: "tableValue",
                      },
                      "\n",
                    ],
                    margin: [10, 5, 0, 10],
                  },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            margin: [0, 15, 0, 0],
            table: {
              widths: [170, 170, 170],
              body: [
                [
                  {
                    text: "Pathogens",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                  {
                    text: "Result",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                  {
                    text: "Remark",
                    alignment: "center",
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen1?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen1?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen1?.remark,
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen2?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen2?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen2?.remark,
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen3?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen3?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen3?.remark,
                    style: "tableSecVal",
                  },
                ],
                [
                  { text: labtestPdf?.pathogen4?.name, style: "tableSecVal" },
                  {
                    text: labtestPdf?.pathogen4?.result,
                    style: "tableSecVal",
                  },
                  {
                    text: labtestPdf?.pathogen4?.remark,
                    style: "tableSecVal",
                  },
                ],
              ],
            },
            layout: {
              fillColor: function (rowIndex: any, node: any, columnIndex: any) {
                return rowIndex === 0 ? "#D7D7D7" : null;
              },

              hLineStyle: function (i: any, node: any) {
                if (i === 0 || i === 1 || i === node.table.body.length) {
                  return null;
                }
                return { dash: { length: 5, space: 2 } };
              },
            },
          },
          {
            text: [
              { text: "Detection Method : ", style: "tableKey" },
              {
                text: lab?.detection_method || "",
                style: "tableValue",
              },
              "\n\n",
              { text: "COMMENT :  ", style: "tableValue" },
              { text: lab?.comment || "", style: "tableValue" },
            ],
          },
          {
            style: "tableExample",
            margin: [0, 70, 0, 0],
            table: {
              widths: [500],

              body: [
                [
                  {
                    border: [false, true, false, false],
                    text: [],
                  },
                ],
              ],
            },
          },
          {
            text: [
              { text: "Reported by : ", style: "tableKey" },
              {
                text: reportBy?.first_name + " " + reportBy?.last_name,
                style: "tableValue",
              },
              "\n\n",
              { text: "Approved by : ", style: "tableKey" },
              {
                text: approveBy?.first_name + " " + reportBy?.last_name,
                style: "tableValue",
              },
            ],
          },
          {
            image: logo.result,
            width: 500,
            height: 200,
            margin: [0, 30, 0, 0],
          },
          //   {
          //     text: [
          //       { text: "remark", style: "tableValue" },
          //       "\n",
          //       {
          //         text: "1. ใบรายงานผล รองรับเฉพาะตัวอย่างที่ใด้รับการทตสอบในครั้งนี้เท่านั้น",
          //         style: "tableValue",
          //       },
          //       "\n",
          //       {
          //         text: "2. ผล Positive ให้ทำการตรวจยืนยันด้วยวิชี RT -PCR และให้กลับไปกักตัวที่บ้านจนกว่าจะทราบผลการตรวจ RT-PCR",
          //         style: "tableValue",
          //       },
          //       "\n",
          //       {
          //         text: "3. ผa Negative : ไม่พบเชื้อ",
          //         style: "tableValue",
          //       },
          //       "\n",
          //       {
          //         text: "3.1 หากเป็นผู้สัมผัสใกล้ชิดผู้สงสัยสัมผัส แนะนำกักตัว เ4 วัน แยกของใช้ส่วนตัวทุกชนิด เช่น จานช้อน แก้ว ผ้าขนหนู โทรศัพท์ โคยไม่ใช้ร่วมกับผู้อื่น",
          //         style: "tableValue",
          //       },
          //       "\n",
          //       {
          //         text: "3.2 สังเกตอาการตนเอง หากพบอาการผิดปกติน มีใข้ ไอ เจ็บคอ มีน้ำมูก จมูกไม่ไดักลิ่น ลิ้นไม่รับรส หรือมีความเสี่ยงที่จะติดเชื้อ ให้เข้ารับการตรวจด้วยธี RT-PCR",
          //         style: "tableValue",
          //       },
          //       "\n",
          //       {
          //         text: "4. ผู้ติดเชื้อโควิด-19 รายใหม่ ที่ต้องการเข้า ระบบการดูแลที่บ้าน (Home Isolation) สามารถลงทะเบียนทางเว็บ สปสช.สแกน QR Code และ ทางไลน์",
          //         style: "tableValue",
          //       },
          //       "\n",
          //     ],
          //     margin: [70, 30, 0, 0],
          //   },
        ],
      ]);

    template.styles = {
      header: {
        fontSize: 14,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      tableKey: {
        fontSize: 10,
        bold: true,
      },
      tableValue: {
        fontSize: 10,
      },
      tableSecVal: {
        fontSize: 11,
        bold: true,
        margin: [0, 2, 0, 2],
      },
    };

    // pdfMake.createPdf(template).open();
    return new Promise((resolve, reject) => {
      try {
        const doc = pdfMake.createPdf(template);
        doc.getBuffer(async function (buffer) {
          resolve(buffer);
        });
      } catch (e) {
        reject("Error pdfMake.createPdf()");
      }
    });
  }
}
