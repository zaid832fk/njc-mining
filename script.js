document.addEventListener('DOMContentLoaded', () => {
    const highInput = document.getElementById('high');
    const lowInput = document.getElementById('low');
    const currentInput = document.getElementById('current');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsContainer = document.getElementById('results-container');

    calculateBtn.addEventListener('click', () => {
        const high = parseFloat(highInput.value);
        const low = parseFloat(lowInput.value);
        const current = parseFloat(currentInput.value);

        if (isNaN(high) || isNaN(low) || isNaN(current) || high <= low) {
            resultsContainer.innerHTML = `<p id="analysis-text">يرجى إدخال قيم صحيحة. يجب أن تكون القمة (High) أعلى من القاع (Low).</p>`;
            return;
        }

        // تحديد الاتجاه
        const isUptrend = current > low; // افتراض بسيط: إذا كان السعر الحالي أقرب للقمة فهو اتجاه صاعد

        const range = high - low;

        const levels = [
            { percent: 23.6, value: isUptrend ? high - (range * 0.236) : low + (range * 0.236) },
            { percent: 38.2, value: isUptrend ? high - (range * 0.382) : low + (range * 0.382) },
            { percent: 50.0, value: isUptrend ? high - (range * 0.5) : low + (range * 0.5) },
            { percent: 61.8, value: isUptrend ? high - (range * 0.618) : low + (range * 0.618) },
            { percent: 78.6, value: isUptrend ? high - (range * 0.786) : low + (range * 0.786) }
        ];

        renderResults(levels, current, isUptrend);
    });

    function renderResults(levels, current, isUptrend) {
        resultsContainer.innerHTML = ''; // مسح النتائج السابقة

        const trendType = isUptrend ? 'support' : 'resistance';
        const trendText = isUptrend ? 'مستوى دعم' : 'مستوى مقاومة';

        levels.forEach(level => {
            const levelDiv = document.createElement('div');
            levelDiv.className = `level ${trendType}`;

            if (level.percent === 61.8) {
                levelDiv.classList.add('golden');
            }

            levelDiv.innerHTML = `
                <div class="level-info">
                    <span class="level-percent">${trendText} ${level.percent}%</span>
                    <span class="level-price">${level.value.toFixed(4)}</span>
                </div>
            `;
            resultsContainer.appendChild(levelDiv);
        });

        // إضافة تحليل بسيط
        let analysis = generateAnalysis(levels, current, isUptrend);
        const analysisDiv = document.createElement('div');
        analysisDiv.id = 'analysis-text';
        analysisDiv.innerHTML = analysis;
        resultsContainer.appendChild(analysisDiv);
    }

    function generateAnalysis(levels, current, isUptrend) {
        let closestLevel = null;
        let minDiff = Infinity;

        levels.forEach(level => {
            const diff = Math.abs(current - level.value);
            if (diff < minDiff) {
                minDiff = diff;
                closestLevel = level;
            }
        });

        if (isUptrend) {
             if (current > levels[0].value) return `السعر الحالي فوق جميع مستويات الدعم، مما يشير إلى قوة الاتجاه الصاعد.`;
             return `السعر الحالي قريب من منطقة الدعم ${closestLevel.percent}%. هذه منطقة شراء محتملة إذا ظهرت علامات انعكاس صعودية.`;
        } else {
            if (current < levels[0].value) return `السعر الحالي تحت جميع مستويات المقاومة، مما يشير إلى قوة الاتجاه الهابط.`;
            return `السعر الحالي قريب من منطقة المقاومة ${closestLevel.percent}%. هذه منطقة بيع محتملة إذا ظهرت علامات انعكاس هبوطية.`;
        }
    }
});