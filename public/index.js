(function () {
    'use strict'
    window.var = {};
    const domain = 'http://localhost:8080'
    const categories = {}
    const quizHewan = function () {
        fetch(`${domain}?path=/api/quiz/kategori/hewan`)
            .then(function (res) {
                debugger;
                return res.json();
            })
            .then(res => {
                return res['data']
            })
            .then(function (data) {
                window.var.quizHewan = data;
            })
            // window.var.quizHewan = JSON.parse(r.response);
    }()
    const quizKendaraan = function () {
        fetch(`${domain}?path=/api/quiz/kategori/kendaraan`)
            .then(function (res) {
                debugger;
                return res.json();
            })
            .then(res => {
                return res['data']
            })
            .then(function (data) {
                window.var.quizKendaraan = data;
            })
    }
    const ls = localStorage
    const TOTAL = 5
    var el = window.el = {}
    el.currentCategory = 'hewan'
    el.activeSoal = []
    el.currentJawaban = ''
    el.currentSoal = 1
    el.totalSoal = TOTAL
    el.soalTerjawab = []
    el.setupViews = function () {
        const h = window.screen.height + 'px'
        const w = window.screen.width + 'px'
        $('#img-splash').css({width: w, height: h})
    }
    el.showElements = function (selectors = []) { // harus menggunakan tanda #
        if (!selectors && !selectors[0]) throw new Error('Invalid Selectors')
        console.log('show elements', selectors.join(', '))
        for (const x of selectors) {
            $(x).removeClass('hide')
            // debugger
        }
    }
    el.hideElements = function (selectors = []) { // harus menggunakan tanda #
        if (!selectors && !selectors[0]) throw new Error('Invalid Selectors')
        console.log('hide elements', selectors.join(', '))
        for (const x of selectors) {
            $(x).addClass('hide')
            // debugger
        }
    }
    el.reset = function () {
        el.currentJawaban = ''
        el.currentSoal = 1
        el.totalSoal = TOTAL
        el.soalTerjawab = []
        debugger
    }
    el.showPage = function (page = 'splash') {
        console.log('show page', page)
        el.hideElements(['#page-splash', '#page-start', '#page-select-category', '#page-soal', '#page-result', '#page-best-score'])
        switch (page) {
            case 'splash':
                el.showElements(['#page-splash'])
                break;
            case 'start':
                el.showElements(['#page-start'])
                break;
            case 'category':
                el.showElements(['#page-select-category'])
                break;
            case 'result':
                el.showElements(['#page-result'])
                el.setupResult()
                break;
            case 'paket-hewan':
                el.currentCategory = 'hewan'
                el.activeSoal = window.var.quizHewan
                el.reset()
                el.showElements(['#page-soal'])
                el.nextSoal({})
                break;
            case 'paket-kendaraan':
                el.currentCategory = 'kendaraan'
                el.activeSoal = window.var.quizKendaraan
                el.reset()
                el.showElements(['#page-soal'])
                el.nextSoal({})
                break;
            case 'splash':
                el.showElements(['#page-best-score'])
                break;
            default:
                alert('invalid page')
                break;
        }
    }
    el.startQuiz = function (category) {
        el.hideElements(['#tombol-result'])
        el.showElements(['#tombol-lanjut'])
        $('#total-soal').html(el.totalSoal)
        el.showPage(category)
    }
    el.setJawabanTo = function (jawaban = '') {
        if (jawaban.length === 1) {
            el.currentJawaban = jawaban
        }
    }
    el.saveAndNext = function () {
        const currentSoal = el.currentSoal + 1
        const jawaban = el.currentJawaban
        if (jawaban.length === 0) return el.alert('Kamu Belum Menjawab')
        el.soalTerjawab.push(jawaban)
        if (currentSoal <= el.totalSoal) {
            el.currentSoal += 1 // ditambah dulu baru load soal selanjutnya
            if (currentSoal === el.totalSoal) {
                el.nextSoal({ isLastRecord: true }) // load soal selanjutnya TERAKHIR
            } else {
                el.nextSoal({}) // load soal selanjutnya
            }
        }
    }
    el.nextSoal = function ({ isLastRecord }) {
        const currentSoal = el.currentSoal
        const indexSoal = currentSoal - 1
        const soal = el.activeSoal[indexSoal]
        $('#num-soal').html(currentSoal)
        $('#img-soal').attr('src', soal.image)
        $('#soal-text').html(soal.question)
        $('#jawaban-text-a').html(soal.pilihan_a)
        $('#jawaban-text-b').html(soal.pilihan_b)
        $('#jawaban-text-c').html(soal.pilihan_c)
        $('#jawaban-text-d').html(soal.pilihan_d)
        if (isLastRecord) {
            el.hideElements(['#tombol-lanjut'])
            el.showElements(['#tombol-result'])
        }
        // debugger
    }
    el.setupResult = function () {
        const jawaban = el.currentJawaban
        el.soalTerjawab.push(jawaban) // jawaban terakhir
        const allSoal = el.totalSoal
        const terjawab = el.soalTerjawab
        let benar = 0
        let salah = 0
        let total = 0
        for (const index in el.activeSoal) {
            if (el.activeSoal[index]['answer'] === terjawab[index]) {
                benar += 1
                total += 20
            } else {
                salah += 1
            }
        }
        let color = 'text-success'
        if (total < 50) color = 'text-danger'
        else if (total < 70) color = 'text-warning'
        else if (total < 90) color = 'text-info'
        $('#result-score').html(`<span class="${color}">${total}</span>`)
        $('#result-soal-count').html(allSoal)
        $('#result-all').html(terjawab.length)
        $('#result-correct').html(benar)
        $('#result-wrong').html(salah)
    }
    el.setupViews() // set height and width
    console.log('starting app...')
    setTimeout(function () {
        el.showConfirmBacksound()
        // debugger
    }, 1 * 1000)
    el.showPage('splash')
    el.alert = function (message = '') {
        $('#alert-message').html(message)
        $('#alert').modal('show')
    }
    el.showConfirmBacksound = function () {
        $('#confirm-backsound').modal('show')
    }
    el.confirmBacksound = function (type = 'yes') {
        if (type === 'yes') {
            el.playbacksound()
        }
        setTimeout(function () {
            el.showPage('start')
        }, 5 * 1000)
    }
    el.playbacksound = function () {
        const sound = document.getElementById("backsound")
        sound.loop = true
        sound.play()
    }
})()
