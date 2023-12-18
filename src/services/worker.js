// worker.js

onmessage = async function (e) {
    const { url, headers } = e.data;

    console.log('testing');
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
  
      const data = await response.json();
  
      // Send the fetched data back to the main thread
      postMessage(data);
    } catch (error) {
      // Handle errors
      postMessage({ error: error.message });
    }
  };
  