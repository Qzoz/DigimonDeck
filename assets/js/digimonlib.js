class CardSlides {
    constructor(level) {
        this.targetId = `#${level}-slider`;
        this.level = level;
    }
    generate(swiperInstance, jsonData) {
        $(this.targetId).find("#slide-count").html((jsonData)? `${jsonData.length}`:"&mdash;");
        $(this.targetId).find("#slide-no").html((jsonData)? "1":"&mdash;");
        $(this.targetId).find(".swiper-lazy-preloader").remove();
        jsonData.forEach((data) => {
            let slideDiv = $("<div></div>", {
                "class": "swiper-slide"
            });
            let cardDiv = $("<div></div>", {
                "class": "digi-card"
            });
            let img = $("<img/>", {
                "class": "digi-card-img",
                "alt": `${data["name"]}-Image`, "src": `${data["img"]}`
            });
            let nameDiv = $("<div></div>", {
                "class": "digi-card-tag"
            });
            let name = $("<h1></h1>", {
                "class": "font-chewy"
            });
            name.append(`${data["name"]}`);
            nameDiv.append(name);
            cardDiv.append(img, nameDiv);
            slideDiv.append(cardDiv);
            swiperInstance.appendSlide(slideDiv);
        });
        const xThis = this;
        swiperInstance.on("slideChange", function() {
            $(xThis.targetId).find("#slide-no").html(`${swiperInstance.activeIndex + 1}`);
        });
    }
    create(swiperInstance) {
        const xThis = this;
        $.ajax({
            method: "GET",
            url: `https://digimon-api.herokuapp.com/api/digimon/level/${this.level}`
        }).done(function (data) {
            xThis.generate(swiperInstance, data);
        });
    }
}

class SwipersInstanceGen {
    constructor(targetList) {
        this.targetMapData = {};
        this.targetList = targetList;
        this.targetList.forEach((target) => {
            this.targetMapData[target] = this.getSwiperInstance(`#${target}-slider`)
        });
    }
    getSwiperInstance(targetQuery) {
        return new Swiper(targetQuery, {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 1,
            coverflowEffect: {
                rotate: 40,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            breakpoints: {
                '@0.6': {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                '@1.3': {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'progressbar',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }
}

const swiperInstances = new SwipersInstanceGen(["fresh", "training", "rookie", "champion", "ultimate", "mega"]);

$().ready(() => {
    const babySwiper = swiperInstances.targetMapData["fresh"];
    const trainingSwiper = swiperInstances.targetMapData["training"];
    const rookieSwiper = swiperInstances.targetMapData["rookie"];
    const championSwiper = swiperInstances.targetMapData["champion"];
    const ultimateSwiper = swiperInstances.targetMapData["ultimate"];
    const megaSwiper = swiperInstances.targetMapData["mega"];

    setTimeout(function () {
        const loaderScreen = $('.loader-screen');
        $(".loader-img").addClass("animation-loader-gone");
        loaderScreen.addClass("animation-loader-gone");
        setTimeout(function () {
            loaderScreen.remove();
        }, 1500);
    }, 2000);


    let babySlides = new CardSlides('fresh');
    let trainigSlides = new CardSlides('training');
    let rookieSlides = new CardSlides('rookie');
    let championSlides = new CardSlides('champion');
    let ultimateSlides = new CardSlides('ultimate');
    let megaSlides = new CardSlides('mega');

    babySlides.create(babySwiper);
    trainigSlides.create(trainingSwiper);
    rookieSlides.create(rookieSwiper);
    championSlides.create(championSwiper);
    ultimateSlides.create(ultimateSwiper);
    megaSlides.create(megaSwiper);
});
