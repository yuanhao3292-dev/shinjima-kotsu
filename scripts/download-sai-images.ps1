$dir = 'C:\Users\yyds\shinjima-kotsu\public\images\sai-clinic'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$downloads = @(
  @('doctor.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/doctor.jpg'),
  @('logo.svg', 'https://saicli.jp/wp-content/themes/initializr/img/logo.svg'),
  @('hero-01.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/topFvImg01.jpg'),
  @('hero-02.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/topFvImg02.jpg'),
  @('hero-03.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/topFvImg03.jpg'),
  @('hero-04.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/topFvImg04.jpg'),
  @('hero-05.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/topFvImg05.jpg'),
  @('gallery-1.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutGalleryImg1.jpg'),
  @('gallery-2.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutGalleryImg2.jpg'),
  @('gallery-3.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutGalleryImg3.jpg'),
  @('gallery-4.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutGalleryImg4.jpg'),
  @('gallery-5.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutGalleryImg5.jpg'),
  @('gallery-6.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutGalleryImg6.jpg'),
  @('gallery-7.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutGalleryImg7.jpg'),
  @('gallery-8.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutGalleryImg8.jpg'),
  @('gallery-9.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutGalleryImg9.jpg'),
  @('concept-1.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutConcept1.jpg'),
  @('concept-2.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutConcept2.jpg'),
  @('concept-3.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutConcept3.jpg'),
  @('concept-4.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutConcept4.jpg'),
  @('feature-01.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/topFeatureImg01.jpg'),
  @('feature-02.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/topFeatureImg02.jpg'),
  @('about-feature-1.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutFeatureItem1.jpg'),
  @('about-feature-2.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/aboutFeatureItem2.jpg'),
  @('promise-1.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/promiseIcon1.jpg'),
  @('promise-2.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/promiseIcon2.jpg'),
  @('promise-3.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/promiseIcon3.jpg'),
  @('threadlift-title.jpg', 'https://saicli.jp/wp-content/uploads/2025/06/sai_threadlift_title.jpg'),
  @('threadlift-hero.jpg', 'https://saicli.jp/wp-content/uploads/2025/06/sai_threadlift_title_3-1024x576.jpg'),
  @('case-40s-01.jpg', 'https://saicli.jp/wp-content/uploads/2025/05/SAI_PH_threadlift_009-01-819x1024.jpg'),
  @('case-50s-01.jpg', 'https://saicli.jp/wp-content/uploads/2025/08/SAI_PH_threadlift_001-01-819x1024.jpg'),
  @('case-50s-02.jpg', 'https://saicli.jp/wp-content/uploads/2025/11/SAI_PH_threadlift_006-01-819x1024.jpg'),
  @('case-018-01.jpg', 'https://saicli.jp/wp-content/uploads/2026/02/b94a030b9f33142b0e66cb78fb9c60a0.jpg'),
  @('case-018-02.jpg', 'https://saicli.jp/wp-content/uploads/2026/02/edd74fab7b76a46a439fdd1cc3a277aa.jpg'),
  @('case-015-01.jpg', 'https://saicli.jp/wp-content/uploads/2025/12/SAI_PH_threadlift_015-01.jpg'),
  @('case-015-02.jpg', 'https://saicli.jp/wp-content/uploads/2025/12/SAI_PH_threadlift_015-02.jpg'),
  @('case-015-03.jpg', 'https://saicli.jp/wp-content/uploads/2025/12/SAI_PH_threadlift_015-03.jpg'),
  @('recommend.jpg', 'https://saicli.jp/wp-content/themes/initializr/img/a-reccoImg.jpg'),
  @('sign.png', 'https://saicli.jp/wp-content/themes/initializr/img/sign.png')
)

$ok = 0
$fail = 0
foreach ($item in $downloads) {
  $filename = $item[0]
  $url = $item[1]
  $outPath = Join-Path $dir $filename
  try {
    Invoke-WebRequest -Uri $url -OutFile $outPath -UseBasicParsing -TimeoutSec 15
    $size = (Get-Item $outPath).Length
    Write-Output "OK: $filename ($([math]::Round($size/1024))KB)"
    $ok++
  } catch {
    Write-Output "FAIL: $filename"
    $fail++
  }
}
Write-Output "`nDone: $ok success, $fail failed"
