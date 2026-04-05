const form = document.getElementById('subscription-form');
const result = document.getElementById('result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  result.textContent = 'Creating subscription...';

  const customerId = document.getElementById('customerId').value.trim();
  const planId = document.getElementById('planId').value.trim();

  try {
    const response = await fetch('/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId, planId }),
    });

    const data = await response.json();

    if (!response.ok) {
      result.textContent = `Error: ${data.error || 'Unable to create subscription'}`;
      result.style.color = '#f87171';
      return;
    }

    result.style.color = '#a7f3d0';
    result.textContent = 'Subscription created successfully!';
    result.textContent += `\nSubscription ID: ${data.id}`;
  } catch (error) {
    result.textContent = `Request failed: ${error.message}`;
    result.style.color = '#f87171';
  }
});
