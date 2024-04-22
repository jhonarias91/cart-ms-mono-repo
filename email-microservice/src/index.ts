import { log } from "console";
import { EachMessagePayload, Kafka } from "kafkajs";
import { createTransport } from "nodemailer"

const kafka = new Kafka({
    clientId: 'my_email-consumer',
    brokers: ['pkc-419q3.us-east4.gcp.confluent.cloud:9092'],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: 'VLXJXOYVUEFBAQKD',
        password: 'VG9Ma3r32e+Oa8rw7Y5QWhHHujF1pu8LJGzfQQ5jZmkOkUCe3zdIsQdUUUtxppsi'
    }
});

const consumer = kafka.consumer({ groupId: 'my_email-consumer' });

const transporter = createTransport({
    host: 'mailhog',
    port: 1025
});

const run = async () => {   
    await consumer.connect();
    await consumer.subscribe({ topic: 'topic_01' });
    await consumer.run({
        eachMessage: async (message: EachMessagePayload) => {
            const order = JSON.parse(message.message.value.toString())
            
            await transporter.sendMail({
                from: 'from@example.com',
                to: 'admin@admin.com',
                subject: 'An order has been completed',
                html: `Order #${order.id} with a total of $${order.admin_revenue} has been completed`
            });

            await transporter.sendMail({
                from: 'from@example.com',
                to: order.ambassador_email,
                subject: 'An order has been completed',
                html: `You earned $${order.ambassador_revenue} from the link #${order.code}`
            });

            await transporter.sendMail({
                from: 'from@example.com',
                to: order.email,
                subject: `Purcharse on the Pyramid`,
                html: ` ${order.first_name} thank you for your purcharse on the Pyramid 
                on http://localhost:5000/${order.code} resume: ${resume(order.order_items)}`
            });

            await transporter.close();
        }
    })
}
run().then(console.error);


 function resume(order_items:any){

    // Calculate total quantity, total price, and total revenues
    let total_quantity = 0, total_price = 0;
    order_items.forEach(item => {
        total_quantity += item.quantity;
        total_price += item.price * item.quantity; // Total price is price * quantity
    });

    // Creating a summary object
    const order_summary = {
        total_items: order_items.length,
        total_quantity: total_quantity,
        total_price: total_price
    };
    // Using pretty print for better readability in email
    return JSON.stringify(order_summary, null, 2); 
}
