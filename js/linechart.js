// Parse the CSV data into the necessary arrays



async function getData(){
    
    const response = await fetch('../data/indices.csv');
    const data = await response.text(); // csv in text format
    //console.log(data);

    const xSubject = []; // x-axis labels = subjects
    const noMedia = []; // y-axis labels = cognitive dissonance indices
    const randomMedia = []; //
    const relatedMedia = []; //
    const table = data.split('\n').slice(0);    //split by line and remove 0th row
    //console.log(table);

    table.forEach(row => {                  //operate on each row
        const columns = row.split(',');     // split each row into col.
        const subject = columns[0];            // assign year value
        xSubject.push(subject);                  // push year value into array
        const noMediaIndex = parseFloat(columns[1]);            // global temp. deviation
        noMedia.push(noMediaIndex);                  // push temp value into array
        const randomMediaIndex = parseFloat(columns[2]);     
        randomMedia.push(randomMediaIndex);     // north hemisphere temperature
        const relatedMediaIndex = parseFloat(columns[3]);
        relatedMedia.push(relatedMediaIndex);     
        //const nhPrecip = columns[4];
        //const shPrecip = columns[5];
        //console.log(year, temp, nhTemp, shTemp);
        

    })
    console.log(xSubject)
    console.log(noMedia)
    console.log(randomMedia)
    console.log(relatedMedia)
    return {xSubject, noMedia, randomMedia, relatedMedia}
}

async function createChart(){
    const data = await getData(); // will wait until getData() processes
        // Configured for chart.JS 3.x and above

const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
    
    type: 'bar',
    data: {
        labels: data.xSubject,
        datasets: [{
            label: 'No Media',
            data: data.noMedia,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        },
        {
            label: 'Random Media',
            data: data.randomMedia,
            backgroundColor: 'rgba(132, 255, 99, 0.2)',
            borderColor: 'rgba(132, 255, 99, 1)',
            borderWidth: 1
        },
        {
            label: 'Related Media',
            data: data.relatedMedia,
            backgroundColor: 'rgba(99, 132, 255, 0.2)',
            borderColor: 'rgba(99, 132, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,                   // Re-size based on screen size
        scales: {                           // x & y axes display options
            x: {
                title: {
                    display: true,
                    text: 'Subject',
                    font: {
                        size: 20
                    },
                },
                ticks: {
                    callback: function(val, index){
                        return index % 1 === 0 ? this.getLabelForValue(val) : "";
                    },
                    font: {
                        size: 8
                    }
                }
                
            },
            y: {
                grace: "20%",
                min: 10,
                max: 50,
                title: {
                    display: true,
                    text: 'Cognitive Dissonance Index',
                    font: {
                        size: 20
                    },
                },
                
            }
        },
        plugins: {                          // title and legend display options
            title: {
                display: true,
                text: 'Cognitive Dissonance Index (from 10 to 50) After Exposure To Various Media',
                font: {
                    size: 24
                },
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
            legend: {
                position: 'bottom'
            }
        }
    }
});
}

createChart();