import React, {useEffect, useState} from 'react';
import Layout from "../components/Layout";
import { axiosProductsApi } from '../axios/axiosInstances';
import dotenv from 'dotenv';

dotenv.config();

const checkoutUrl = process.env.CHECKOUT_URL;

const Stats = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        (
            async () => {
                const {data} = await axiosProductsApi.get('stats');
                setStats(data);
            }
        )();
    }, []);
    return (
        <Layout>
            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Revenue</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stats.map((s: { code: string, revenue: number }, index) => {
                        return (
                            <tr key={index}>
                                <td>{`${checkoutUrl}/${s.code}`}</td>
                                <td>{s.code}</td>
                                <td>{s.revenue}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Stats;
