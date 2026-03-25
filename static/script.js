let currentMode = 'pass';
let history = [];
const blacklist = ["123456", "password", "admin", "banana", "12345678"];

function setMode(m) {
    currentMode = m;
    document.getElementById('btnPass').classList.toggle('active', m === 'pass');
    document.getElementById('btnUser').classList.toggle('active', m === 'user');
    document.getElementById('strengthCont').style.display = m === 'pass' ? "block" : "none";
    document.getElementById('settingsSection').style.opacity = m === 'pass' ? "1" : "0.3";
    document.getElementById('qrcode').innerHTML = "";
}

function run() {
    const display = document.getElementById('resultDisplay');
    if (currentMode === 'pass') {
        const len = document.getElementById('lenSlider').value;
        let pool = (document.getElementById('chkU').checked ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "") +
                   (document.getElementById('chkL').checked ? "abcdefghijklmnopqrstuvwxyz" : "") +
                   (document.getElementById('chkN').checked ? "0123456789" : "") +
                   (document.getElementById('chkS').checked ? "!@#$%^&*()_+" : "");
        
        if(!pool) return alert("اختر نوع واحد على الأقل!");
        
        let pass = "";
        let rand = new Uint32Array(len);
        window.crypto.getRandomValues(rand);
        for(let i=0; i<len; i++) pass += pool.charAt(rand[i] % pool.length);
        
        display.value = pass;
        analyzeStrength(pass);
        generateQR(pass);
        addToHistory(pass);
    } else {
        const adjs = ["Cyber", "Neon", "Alpha", "Shadow"];
        const nouns = ["Banana", "Viper", "Storm", "Byte"];
        const res = adjs[Math.floor(Math.random()*adjs.length)] + "_" + nouns[Math.floor(Math.random()*nouns.length)] + Math.floor(Math.random()*99);
        display.value = res;
        document.getElementById('qrcode').innerHTML = "";
    }
}

function analyzeStrength(val) {
    const bar = document.getElementById('strengthBar');
    const text = document.getElementById('stText');
    const warn = document.getElementById('warningMsg');
    const crack = document.getElementById('crackTime');
    
    document.getElementById('charCount').innerText = val.length + " حرف";
    warn.innerText = ""; bar.className = "bar-fill"; crack.innerText = "";
    
    if(!val) { bar.style.width="0%"; text.innerText="القوة: --"; return; }
    
    if(blacklist.includes(val.toLowerCase())) {
        bar.style.width="15%"; bar.classList.add('weak');
        text.innerText="خطر!"; warn.innerText="⚠️ كلمة مرور مسربة وشائعة!"; return;
    }

    let s = 0;
    if(val.length >= 10) s++; if(val.length >= 18) s++;
    if(/[A-Z]/.test(val)) s++; if(/[0-9]/.test(val)) s++; if(/[^A-Za-z0-9]/.test(val)) s++;

    if(s <= 2) { 
        bar.style.width="30%"; bar.classList.add('weak'); text.innerText="ضعيفة ❌";
        crack.innerText = "وقت التخمين: ثواني/دقائق";
    } else if(s <= 4) { 
        bar.style.width="65%"; bar.classList.add('medium'); text.innerText="جيدة ✅";
        crack.innerText = "وقت التخمين: سنوات";
    } else { 
        bar.style.width="100%"; bar.classList.add('strong'); text.innerText="خارقة 🛡️";
        crack.innerText = "وقت التخمين: قرون";
    }
}

function generateQR(txt) {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    new QRCode(qrDiv, { text: txt, width: 100, height: 100 });
}

function addToHistory(item) {
    history.unshift(item);
    if(history.length > 5) history.pop();
    const list = document.getElementById('historyList');
    list.innerHTML = history.map(h => `<div class="history-item" onclick="copyFromHistory('${h}')">${h}</div>`).join('');
}

function copyFromHistory(txt) {
    navigator.clipboard.writeText(txt);
    alert("تم نسخ الكلمة من السجل!");
}

function copyIt() {
    const input = document.getElementById('resultDisplay');
    if(!input.value) return;
    input.select();
    document.execCommand('copy');
    alert("تم النسخ بنجاح!");
}
