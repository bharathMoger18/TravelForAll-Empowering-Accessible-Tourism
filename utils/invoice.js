/* eslint-disable */
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.generateInvoice = (booking, tour, user) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });

    const fileName = `invoice-${booking._id}.pdf`;
    const invoicePath = path.join(__dirname, `../tmp/${fileName}`);

    const writeStream = fs.createWriteStream(invoicePath);
    doc.pipe(writeStream);

    doc
      .fontSize(20)
      .text('Travel For All', { align: 'center' })
      .fontSize(16)
      .text('Booking Invoice', { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .text('Customer Name: ' + (user && user.name ? user.name : 'N/A'))
      .text('Email: ' + (user && user.email ? user.email : 'N/A'))
      .text('Tour Booked: ' + (tour && tour.name ? tour.name : 'N/A'))
      .text(
        'Duration: ' + (tour && tour.duration ? tour.duration + ' days' : 'N/A')
      )
      .text(
        'Travellers: ' +
          (booking && booking.numTravellers ? booking.numTravellers : 'N/A')
      )
      .text(
        'Total Price: $' + (booking && booking.price ? booking.price : 'N/A')
      )
      .text(
        'Date: ' +
          (booking && booking.createdAt
            ? new Date(booking.createdAt).toLocaleDateString()
            : 'N/A')
      )
      .moveDown();

    doc.text('Thank you for booking with us!', { align: 'center' });

    doc.end();

    writeStream.on('finish', function() {
      resolve(invoicePath);
    });

    writeStream.on('error', function(err) {
      reject(err);
    });
  });
};
