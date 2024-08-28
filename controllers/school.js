import { getClient } from "../db/index.js";


export const addSchool = async (req, res) => {
        const client = await getClient();
        const { name, address, latitude, longitude } = req.body;
        if(!name || !address || !latitude || !longitude){
            return res.status(403).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }
        
        const insertUserText = 'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING id';
        const values = [name, address, latitude, longitude];
        const response = await client.query(insertUserText, values);

        if(!response){
            return res.status(400).json({
                success: false,
                message: 'School data is not uploaded on database'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'School added successfully',
        });
}

export const listSchool = async (req, res) => {
    const client = await getClient();
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: 'Invalid coordinates' });
    }
    const schools = (await client.query('SELECT * FROM schools')).rows;
    const sortedSchools = schools.map(school => {
        const distance = getDistanceFromLatLonInKm(
            parseFloat(latitude),
            parseFloat(longitude),
            school.latitude,
            school.longitude
        );
        return { ...school, distance };
    }).sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedSchools);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}