export async function getBible() {
try {
    const res = await fetch('http://localhost:5000/bibles/test');
    const data = await res.json();
    console.log('API Response:', data);
    return data;
    } catch (error) {
    console.error('Error fetching Bible data:', error);
    throw error;
    }
}