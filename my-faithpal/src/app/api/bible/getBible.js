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

/*
single verse
http://127.0.0.1/john 3:16
abbreviated book name
http://127.0.0.1/jn 3:16
verse range
http://127.0.0.1/romans+12:1-2
multiple ranges
http://127.0.0.1/romans 12:1-2,5-7,9,13:1-9&10
different translation
http://127.0.0.1/john 3:16?translation=kjv
verse numbers
http://127.0.0.1/john 3:16?verse_numbers=true
jsonp
http://127.0.0.1/john+3:16?callback=func
random verse
http://127.0.0.1/?random=verse
*/