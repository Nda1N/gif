const loadingCircle = document.getElementById('loadingCircle');
const gifPopup = document.getElementById('gifPopup');
const popupGif = document.getElementById('popupGif');
const closeButton = document.getElementById('closeButton');
const tapHint = document.getElementById('tapHint');
const markerStatus = document.getElementById('markerStatus');
const markerBoundary = document.getElementById('markerBoundary'); // 赤枠

// GIFのパスを指定
const gifPaths = {
    city1: ['human_tb.gif', 'human_t.gif'],
    city2: ['dog_tb.gif', 'dog_t.gif'],
    city3: ['cat_tb.gif', 'cat_t.gif'],
    city4: ['crow_tb.gif', 'crow_t.gif'],
    grass1: ['giraffe_tb.gif', 'giraffe_t.gif'],
    grass2: ['meerkat_tb.gif', 'meerkat_t.gif'],
    grass3: ['horse_tb.gif', 'horse_t.gif'],
    grass4: ['kangaroo_tb.gif', 'kangaroo_t.gif'],
    jungle1: ['gibbon_tb.gif', 'gibbon_t.gif'],
    jungle2: ['bear_tb.gif', 'bear_t.gif'],
    jungle3: ['ezorisu_tb.gif', 'ezorisu_t.gif'],
    jungle4: ['deer_tb.gif', 'deer_t.gif'],
    ocean1: ['penguin_tb.gif', 'penguin_t.gif'],
    ocean2: ['seal_tb.gif', 'seal_t.gif'],
    ocean3: ['seaotter_tb.gif', 'seaotter_t.gif'],
    ocean4: ['seaturtle_tb.gif', 'seaturtle_t.gif']
};

// マーカー検出ステータスを更新する関数
function updateMarkerStatus(show, isMarkerFound = false) {
    if (isPlaying) return; // GIF再生中は表示しない

    if (show) {
        if (isMarkerFound) {
            markerStatus.innerText = "マーカーを検出中...";
            markerStatus.style.color = "green";
        } else {
            markerStatus.innerText = "マーカーが見つかりません";
            markerStatus.style.color = "red";
        }
        markerStatus.style.display = "block";
    } else {
        markerStatus.style.display = "none";
    }
}

// GIF再生状態
let isPlaying = false;
let currentGifIndex = 0;

// GIFを事前に読み込む
const preloadGifs = () => {
    Object.values(gifPaths).forEach(paths => {
        paths.forEach(path => {
            const img = new Image();
            img.src = path;
        });
    });
};

// GIFを表示する
function showPopupGif(gifPathsArray) {
    if (isPlaying) return;

    isPlaying = true;
    currentGifIndex = 0;
    const gif = popupGif;

    function playGif(index) {
        gif.src = gifPathsArray[index];
        tapHint.style.display = 'block'; // ヒント表示
    }

    loadingCircle.style.display = 'block';
    gifPopup.style.display = 'none';
    markerBoundary.style.display = 'none'; // 赤枠を非表示
    markerStatus.style.display = "block"; // マーカー検出中はそのまま表示

    gif.onload = () => {
        loadingCircle.style.display = 'none';
        gifPopup.style.display = 'block';
    };

    gif.onerror = () => {
        setTimeout(() => {
            playGif(currentGifIndex);
        }, 500);
    };

    playGif(currentGifIndex);

    gif.addEventListener('click', () => {
        currentGifIndex = (currentGifIndex + 1) % gifPathsArray.length;
        playGif(currentGifIndex);
    });

    closeButton.addEventListener('click', () => {
        gifPopup.style.display = 'none';
        isPlaying = false;
        markerBoundary.style.display = 'block'; // GIFを閉じたら赤枠を再表示
        tapHint.style.display = 'none'; // ヒント非表示
    });
}

// マーカー検出時の処理
document.querySelectorAll('a-marker').forEach(marker => {
    marker.addEventListener('markerFound', () => {
        if (isPlaying) return;

        const markerId = marker.id;
        if (gifPaths[markerId]) {
            setTimeout(() => {
                showPopupGif(gifPaths[markerId]);
            }, 1000);
        }
    });

    marker.addEventListener('markerLost', () => {
        if (!isPlaying) {
            markerBoundary.style.display = 'block'; // マーカーが消えたら赤枠を再表示
        }
    });
});

// ページロード時にGIFを事前ロード
window.addEventListener('load', () => {
    preloadGifs();
});
