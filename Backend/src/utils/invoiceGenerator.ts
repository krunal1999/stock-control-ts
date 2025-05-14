import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

interface Product {
  productName: string;
  quantity: number;
  sellPrice: number;
  totalPrice: number;
}

interface InvoiceData {
  orderId: string | undefined;
  userName: string;
  userEmail: string;
  paymentId: string;
  totalPaid: number;
  status: string;
  orderStatus: string;
  products: Product[];
  address: string;
}

export const generateInvoice = async (
  invoiceData: InvoiceData
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });

    const invoiceDir = path.join(__dirname, "../invoices");
    const invoicePath = path.join(
      invoiceDir,
      `invoice-${invoiceData.orderId}.pdf`
    );

    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const stream = fs.createWriteStream(invoicePath);
    doc.pipe(stream);

    // Fonts & styling
    const headingFontSize = 18;
    const normalFontSize = 12;

    // Header
    doc
      .fontSize(headingFontSize)
      .text("INVOICE", { align: "center" })
      .moveDown(1);

    // Order and customer info
    doc
      .fontSize(normalFontSize)
      .text(`Order ID: ${invoiceData.orderId}`)
      .text(`Customer: ${invoiceData.userName}`)
      .text(`Email: ${invoiceData.userEmail}`)
      .text(`Address: ${invoiceData.address}`)
      .text(`Payment ID: ${invoiceData.paymentId}`)
      .text(`Payment Status: ${invoiceData.status}`)
      .text(`Order Status: ${invoiceData.orderStatus}`)
      .moveDown();

    // Product Table Header
    doc
      .fontSize(normalFontSize)
      .font("Helvetica-Bold")
      .text("Product Name", 50, doc.y, { width: 200 })
      .text("Quantity", 250, doc.y, { width: 70, align: "right" })
      .text("Unit Price", 330, doc.y, { width: 100, align: "right" })
      .text("Total", 430, doc.y, { width: 100, align: "right" })
      .moveDown(0.5);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Product rows
    doc.font("Helvetica");
    invoiceData.products.forEach((product) => {
      doc
        .text(product.productName, 50, doc.y, { width: 200 })
        .text(product.quantity.toString(), 250, doc.y, {
          width: 70,
          align: "right",
        })
        .text(`£${product.sellPrice.toFixed(2)}`, 330, doc.y, {
          width: 100,
          align: "right",
        })
        .text(`£${product.totalPrice.toFixed(2)}`, 430, doc.y, {
          width: 100,
          align: "right",
        });
    });

    doc.moveDown(1);

    // Total summary
    doc
      .font("Helvetica-Bold")
      .text("Total Paid:", 330, doc.y, { width: 100, align: "right" })
      .text(`£${invoiceData.totalPaid.toFixed(2)}`, 430, doc.y, {
        width: 100,
        align: "right",
      });

    doc.moveDown(3);

    // Footer
    doc
      .font("Helvetica-Oblique")
      .fontSize(10)
      .text("Thank you for shopping with us!", 50, doc.y, {
        align: "center",
        width: 500,
      });

    doc.end();

    stream.on("finish", () => {
      console.log(`✅ Invoice saved to ${invoicePath}`);
      resolve(invoicePath);
    });

    stream.on("error", (err) => {
      console.error("❌ Error writing PDF:", err);
      reject(err);
    });
  });
};
