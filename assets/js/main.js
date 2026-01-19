document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('quiz-form');
  const result = document.getElementById('result');
  const certArea = document.getElementById('certificate-area');
  const downloadBtn = document.getElementById('download-cert');

  const answers = {
    q1: '4',
    q2: 'red',
    q3: 'HyperText Markup Language'
  };

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(form);
    let correct = 0, total = 0;
    for(const q of ['q1','q2','q3']){
      total++;
      const val = formData.get(q);
      if(val && val === answers[q]) correct++;
    }
    const pct = Math.round((correct/total)*100);
    result.textContent = `Score: ${correct}/${total} (${pct}%)`;
    if(pct >= 66){
      result.textContent += ' — Passed! Enter your name to download a certificate.';
      certArea.style.display = 'block';
    } else {
      result.textContent += ' — Not yet. Review the modules and try again.';
      certArea.style.display = 'none';
    }
  });

  downloadBtn.addEventListener('click', async function(){
    const nameInput = document.getElementById('cert-name');
    const name = (nameInput.value || '').trim();
    if(!name){ alert('Please enter a name for the certificate.'); return; }

    // generate PDF certificate using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({orientation:'landscape',unit:'pt',format:'letter'});
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    doc.setFillColor(43,122,120);
    doc.rect(0,0,width,80,'F');
    doc.setFontSize(32);
    doc.setTextColor(255,255,255);
    doc.text('Certificate of Completion', 40, 50);

    doc.setTextColor(0,0,0);
    doc.setFontSize(22);
    doc.text('This certifies that', width/2, height/2 - 60, {align:'center'});

    doc.setFontSize(30);
    doc.text(name, width/2, height/2 - 20, {align:'center'});

    doc.setFontSize(18);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`has successfully completed the APM Course on ${dateStr}.`, width/2, height/2 + 20, {align:'center'});

    doc.setFontSize(14);
    doc.text('APM Course — GitHub Pages demo', width/2, height - 70, {align:'center'});

    const filename = `${name.replace(/\s+/g,'_')}_certificate.pdf`;
    doc.save(filename);
  });
});
