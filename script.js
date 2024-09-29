class Pendaftar {
  constructor(nama, umur, uangSangu) {
    this.nama = nama
    this.umur = umur
    this.uangSangu = uangSangu
  }
}

class Pendaftaran {
  constructor() {
    this.pendaftarList = []
  }

  async addPendaftar(pendaftar) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.pendaftarList.push(pendaftar)
        resolve('Pendaftar ditambahkan')
      }, 500)
    })
  }

  getAverageUmur() {
    let totalUmur = this.pendaftarList.reduce(
      (total, pendaftar) => total + pendaftar.umur,
      0
    )
    return totalUmur / this.pendaftarList.length
  }

  getAverageUangSangu() {
    let totalUangSangu = this.pendaftarList.reduce(
      (total, pendaftar) => total + pendaftar.uangSangu,
      0
    )
    const avg = totalUangSangu / this.pendaftarList.length
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
    }).format(avg)
  }
}

const pendaftaran = new Pendaftaran()

document.getElementById('submitBtn').addEventListener('click', async () => {
  const nama = document.getElementById('nama').value
  const umurValue = document.getElementById('umur').value
  const uangSanguValue = document.getElementById('uangSangu').value
  const notification = document.querySelector('.notification')

  document.getElementById('namaError').innerText = ''
  document.getElementById('umurError').innerText = ''
  document.getElementById('uangSanguError').innerText = ''

  let hasError = false

  if (nama.length < 10) {
    document.getElementById('namaError').innerText = 'Nama minimal 10 karakter.'
    hasError = true
  }

  if (umurValue === '') {
    document.getElementById('umurError').innerText = 'Umur tidak boleh kosong.'
    hasError = true
  } else {
    const umur = parseInt(umurValue)
    if (umur < 25) {
      document.getElementById('umurError').innerText = 'Umur minimal 25 tahun.'
      hasError = true
    }
  }

  if (uangSanguValue === '') {
    document.getElementById('uangSanguError').innerText =
      'Uang sangu tidak boleh kosong.'
    hasError = true
  } else {
    const uangSangu = parseInt(uangSanguValue)
    if (uangSangu < 100000 || uangSangu > 1000000) {
      document.getElementById('uangSanguError').innerText =
        'Uang sangu minimal 100 ribu dan maksimal 1 juta.'
      hasError = true
    }
  }

  if (!hasError) {
    const pendaftar = new Pendaftar(
      nama,
      parseInt(umurValue),
      parseInt(uangSanguValue)
    )
    await pendaftaran.addPendaftar(pendaftar)

    updateTable()
    notification.classList.add('show')
    setTimeout(() => {
      notification.classList.remove('show')
    }, 3000)
    document.getElementById('nama').value = ''
    document.getElementById('umur').value = ''
    document.getElementById('uangSangu').value = ''
  }
})

function updateTable() {
  const tbody = document.getElementById('pendaftarTable')
  tbody.innerHTML = ''
  if (pendaftaran.pendaftarList.length > 0) {
    pendaftaran.pendaftarList.forEach((pendaftar) => {
      let formattedUangSangu = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
      }).format(pendaftar.uangSangu)

      let row = `<tr>
                <td>${pendaftar.nama}</td>
                <td>${pendaftar.umur}</td>
                <td>${formattedUangSangu}</td>
            </tr>`
      tbody.innerHTML += row
    })
  } else {
    tbody.innerHTML = '<tr><td colspan="3">Belum ada data</td></tr>'
    tbody.classList.add('no-data')
  }

  const resume = document.getElementById('resume')
  if (pendaftaran.pendaftarList.length > 0) {
    resume.innerHTML = `Rata-rata pendaftar memiliki uang sangu sebesar ${pendaftaran.getAverageUangSangu()} dengan rata-rata umur ${pendaftaran.getAverageUmur()} tahun.`
  } else {
    resume.innerHTML = ''
  }
}

document.getElementById('registrasi-tab').addEventListener('click', () => {
  document.getElementById('registrasi-content').style.display = 'block'
  document.getElementById('list-content').style.display = 'none'
  document.getElementById('registrasi-tab').classList.add('active')
  document.getElementById('list-tab').classList.remove('active')
})

document.getElementById('list-tab').addEventListener('click', () => {
  document.getElementById('registrasi-content').style.display = 'none'
  document.getElementById('list-content').style.display = 'block'
  document.getElementById('list-tab').classList.add('active')
  document.getElementById('registrasi-tab').classList.remove('active')
  updateTable()
})
