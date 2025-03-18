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
}

export const generateInvoice = async (
  invoiceData: InvoiceData
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    // Define the invoice directory path
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

    // Invoice Header
    doc.fontSize(20).text("Invoice", { align: "center" }).moveDown();
    // doc.fontSize(14).text(`Order ID: ${invoiceData.orderId}`);
    doc.text(`Customer: ${invoiceData.userName} (${invoiceData.userEmail})`);
    doc.text(`Payment ID: ${invoiceData.paymentId}`);
    doc.text(`Total Paid: £${invoiceData.totalPaid.toFixed(2)}`);
    doc.text(`Payment Status: ${invoiceData.status}`);
    doc.text(`Order Status: ${invoiceData.orderStatus}`).moveDown();

    // Product Table Header
    doc
      .fontSize(12)
      .text("Products Ordered:", { underline: true })
      .moveDown(0.5);
    doc.text("Product Name | Quantity | Price | Total");
    doc.moveDown(0.5);

    // Products
    invoiceData.products.forEach((product) => {
      doc.text(
        `${product.productName} | ${
          product.quantity
        } | £${product.sellPrice.toFixed(2)} | £${product.totalPrice.toFixed(
          2
        )}`
      );
    });

    doc.moveDown(2);
    doc.text("Thank you for shopping with us!", { align: "center" });

    doc.end();

    stream.on("finish", () => {
      console.log(`Invoice saved to ${invoicePath}`);
      resolve(invoicePath);
    });
    stream.on("error", (err) => {
      console.error("❌ Error writing PDF:", err);
      reject(err);
    });
  });
};
