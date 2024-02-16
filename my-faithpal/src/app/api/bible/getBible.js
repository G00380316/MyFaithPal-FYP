export async function getBible(selectedBook , selectedChapter, selectedVerse) {
    try {
        var bookName = selectedBook ? selectedBook.toLowerCase() : '';
        const lastBookName = bookName;

        if (bookName == '') {
            bookName = lastBookName;
        }

        //2 John chapter 1 bug fix
        if (bookName == "2 john" && selectedChapter == 1 && selectedVerse == "") {
            selectedVerse = "1-13"
        }

        //3 John chapter 1 bug fix
        if (bookName == "3 john" && selectedChapter == 1 && selectedVerse == "") {
            selectedVerse = "1-14"
        }


        if (selectedVerse == "") {
            console.log("Entered if statment")
            const res = await fetch(`http://localhost:5000/bible/${bookName}${selectedChapter}`);
            const data = await res.json();
            console.log('API Response:', data);

            return data;
        }
            const res = await fetch(`http://localhost:5000/bible/${bookName}${selectedChapter}:${selectedVerse}`);
            const data = await res.json();
            if (data.error) {
                const NewSelectedVerse = selectedVerse - 1;
                const res = await fetch(`http://localhost:5000/bible/${bookName}${selectedChapter}:${NewSelectedVerse}`);
                const data = await res.json();

                console.log('API Response with Verse plus Error:', data);

                return data;
            }
            console.log('API Response with Verse:', data);
        
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