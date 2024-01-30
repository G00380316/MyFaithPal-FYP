export async function getBible(selectedBook , selectedChapter) {
    try {
        var bookName = selectedBook ? selectedBook.toLowerCase() : '';
        const lastBookName = bookName;

        if (bookName == '') {
            bookName = lastBookName;
        }

        const res = await fetch(`http://localhost:5000/bible/${bookName}${selectedChapter}`);
        const data = await res.json();
        console.log('API Response:', data);
        return data;
        } catch (error) {
        console.error('Error fetching Bible data:', error);
        throw error;
    }
}