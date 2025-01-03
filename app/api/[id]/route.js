import { db } from '../../../lib/db';
import { NextResponse } from 'next/server';

// Test database connection
db.getConnection()
    .then(connection => {
        console.log('Database connected successfully!');
        connection.release(); // Always release the connection after checking
    })
    .catch(error => {
        console.error('Error connecting to the database:', error);
    });
    
export async function GET(request, {params}) {
    const { id } = params

    console.log("id:", id);
    try {
        let rows;

        if (id) {
            // Fetch data for the selected sport ID and year
            [rows] = await db.query('SELECT * FROM teamgames WHERE sportID = ? LIMIT 400', [id]);
        // } else {
        //     // Fetch IDs for the dropdown (default to sportID 2 and yearID 2)
        //     [rows] = await db.query('SELECT * FROM teamgames WHERE sportID = ? LIMIT 400', [2]);
        }

        return NextResponse.json({ rows }, { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
}