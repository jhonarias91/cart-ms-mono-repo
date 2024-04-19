import { EachMessagePayload, Kafka } from "kafkajs"

const kafka = new Kafka({
    clientId: 'email-consumer',
    brokers: ['pkc-419q3.us-east4.gcp.confluent.cloud:9092'],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: 'VLXJXOYVUEFBAQKD',
        password: 'VG9Ma3r32e+Oa8rw7Y5QWhHHujF1pu8LJGzfQQ5jZmkOkUCe3zdIsQdUUUtxppsi'
    }
});

export = kafka.producer();