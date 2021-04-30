class Score {
    // static fontTemplateList = [];
    // static fontLength;
    // static score = 0;

    static initialize() {
        this.fontTemplateList = [];
        let fontWidth = 0;
        for(let i = 0; i < 10; i++) {
            const fontImage = document.getElementById(`font${i}`);
            if (fontWidth === 0) {
                fontWidth = fontImage.width / fontImage.height * Config.fontHeight;
            }
            fontImage.height = Config.fontHeight;
            fontImage.width = fontWidth
            this.fontTemplateList.push(fontImage);
        }

        this.fontLength = Math.floor(Config.stageCols * Config.puyoImgWidth / this.fontTemplateList[0].width);
        this.score = 0;
        this.showScore();
    }
    static showScore () {
        let score = this.score;
        const scoreElement = Stage.scoreElement;
        // まず最初に、scoreElement の中身を空っぽにする
        while (scoreElement.firstChild) {
            scoreElement.removeChild(scoreElement.firstChild);
        }
        // スコアを下の桁から埋めていく
        for(let i = 0; i < this.fontLength; i++) {
            // 10で割ったあまりを求めて、一番下の桁を取り出す
            const number = score % 10;
            // 一番うしろに追加するのではなく、一番前に追加することで、スコアの並びを数字と同じようにする
            scoreElement.insertBefore(this.fontTemplateList[number].cloneNode(true), scoreElement.firstChild);
            // 10 で割って次の桁の準備をしておく
            score = Math.floor(score / 10);
        }
    }
}