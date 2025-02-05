document.getElementById('calculateButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: calculatePlaylistDuration,
      },
      (results) => {
        if (chrome.runtime.lastError) {
          console.error("Error executing script:", chrome.runtime.lastError.message);
          document.getElementById('totalDuration').textContent = "An error occurred!";
          return;
        }

        const totalDuration = results[0]?.result;
        if (totalDuration === "No playlist detected!") {
          document.getElementById('totalDuration').textContent = totalDuration;
        } else {
          document.getElementById('totalDuration').textContent = `Total Duration: ${totalDuration}`;
        }
      }
    );
  });
});

function calculatePlaylistDuration() {
  try {
    const timeElements = document.querySelectorAll('span.ytd-thumbnail-overlay-time-status-renderer');
    if (!timeElements || timeElements.length === 0) {
      return "No playlist detected!";
    }

    let totalSeconds = 0;

    timeElements.forEach((element) => {
      const timeString = element.textContent.trim();
      const timeParts = timeString.split(':').map(Number);
      if (timeParts.length === 2) {
        totalSeconds += timeParts[0] * 60 + timeParts[1];
      } else if (timeParts.length === 3) {
        totalSeconds += timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  } catch (error) {
    console.error("Error in calculatePlaylistDuration:", error);
    return "An error occurred!";
  }
}
