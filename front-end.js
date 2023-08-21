document.getElementById('scheduling-button').addEventListener('click', function(){
    console.log('scheduling button clicked');

    const scheduleData = document.getElementById('schedule-data');

    fetch('/schedule') // Assuming your server is running on localhost:3000
      .then(response => response.json())
      .then(data => {
        data.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.innerHTML = `
          <p>Doctor ID: ${item.Doctors_id}</p>, 
          <p>Schedule Date: ${item.Schedule_Date}</p>,
          <p>Availbility: ${item.Start_time}</p>
          `; // Customize as per your data structure
          scheduleData.appendChild(itemDiv);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
})
