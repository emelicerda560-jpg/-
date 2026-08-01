import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Mail, Phone, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const asset = path => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const projects = [
  { no: '01', title: 'AI 模特主图', en: 'Virtual Model', type: 'AI MODEL · E-COMMERCE', tone: 'model', media: ['/portfolio/models/01.webp','/portfolio/models/04.webp','/portfolio/models/05.webp','/portfolio/models/08.webp','/portfolio/models/11.webp','/portfolio/models/14.webp'] },
  { no: '02', title: '鞋履场景创意', en: 'Footwear Campaign', type: 'AI IMAGE · ART DIRECTION', tone: 'scene', media: ['/portfolio/scenes/01.webp','/portfolio/scenes/02.webp','/portfolio/scenes/03.webp','/portfolio/scenes/04.webp','/portfolio/scenes/07.webp','/portfolio/scenes/08.webp'] },
  { no: '03', title: '买家秀与动态内容', en: 'Social Content', type: 'AI VIDEO · BUYER SHOW', tone: 'buyer', media: ['/portfolio/videos/01.mp4','/portfolio/videos/02.mp4','/portfolio/videos/04.mp4','/portfolio/buyers/05.webp','/portfolio/buyers/06.webp','/portfolio/buyers/07.webp'] },
]

const strengths = [
  ['01', 'AI 视觉生成', '熟练将生成式工具应用于模特、穿搭与商品场景，让创意快速抵达可用素材。'],
  ['02', '电商视觉设计', '围绕商品卖点组织主图、信息图与详情页，兼顾审美表达和转化需求。'],
  ['03', '动态内容制作', '从脚本、拍摄到剪辑完成短视频闭环，并使用 AI 提升商品视频产出效率。'],
  ['04', '落地与协作', '熟悉淘宝、京东、抖音上架流程，理解从视觉设计到内容交付的完整链路。'],
]

function App() {
  const root = useRef(null)
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setHeroReady(true), 1800)
    return () => window.clearTimeout(timer)
  }, [])

  useLayoutEffect(() => {
    const priorityImages = root.current?.querySelectorAll('.project.model .media-grid img') ?? []

    priorityImages.forEach((image, index) => {
      image.decoding = 'async'
      if (index < 3) {
        image.loading = 'eager'
        image.fetchPriority = 'high'
      }
    })

    const videos = root.current?.querySelectorAll('.project video') ?? []
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        const video = entry.target
        if (video.dataset.src) {
          video.src = video.dataset.src
          delete video.dataset.src
          video.load()
          video.play().catch(() => {})
        }
        videoObserver.unobserve(video)
      })
    }, { rootMargin: '400px 0px' })

    videos.forEach(video => {
      video.dataset.src = video.currentSrc || video.src
      video.removeAttribute('src')
      video.autoplay = false
      video.preload = 'none'
      video.load()
      videoObserver.observe(video)
    })

    return () => videoObserver.disconnect()
  }, [])

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      mm.add({ reduceMotion: '(prefers-reduced-motion: reduce)', desktop: '(min-width: 901px)' }, context => {
        const { reduceMotion, desktop } = context.conditions
        if (reduceMotion) return

        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('.hero-video', { scale: 1.16, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.09, duration: 2.2, ease: 'power3.inOut' }, 0)
          .fromTo('.site-nav', { yPercent: -110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.1 }, 0.15)
          .fromTo('.cover-meta span', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.12 }, 0.35)
          .fromTo('.hero .eyebrow', { x: -34, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1 }, 0.55)
          .fromTo('.hero h1', { clipPath: 'inset(0 100% 0 0)', x: -70, scaleX: 0.82, transformOrigin: 'left center' }, { clipPath: 'inset(0 0% 0 0)', x: 0, scaleX: 1, duration: 1.45, ease: 'expo.out' }, 0.65)
          .fromTo('.cover-sub', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.05 }, 1.05)
          .fromTo('.cover-word', { clipPath: 'inset(0 0 100% 0)', y: 90, scaleX: 1.12, transformOrigin: 'center bottom' }, { clipPath: 'inset(0 0 0% 0)', y: 0, scaleX: 1, duration: 1.55, ease: 'power4.out' }, 1.05)
          .fromTo('.hero-bottom', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 1.55)

        ;[
          ['.about', '.bio h2'],
          ['.work-section', '.section-head h2'],
          ['.strength-section', '.strength-title h2'],
          ['.footer', '.footer h2'],
        ].forEach(([section, title]) => {
          gsap.fromTo(`${section} ${title}`, {
            y: 110, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)', scaleY: 1.08, transformOrigin: 'center bottom',
          }, {
            y: 0, autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', scaleY: 1, duration: 1.35, ease: 'power4.out',
            scrollTrigger: { trigger: section, start: 'top 78%', once: true },
          })
        })

        gsap.from('.about-grid > *, .stats > div', {
          y: 70, autoAlpha: 0, duration: 1.15, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-grid', start: 'top 76%', once: true },
        })

        gsap.utils.toArray('.project').forEach(project => {
          const media = project.querySelectorAll('.media-grid > *')
          const info = project.querySelector('.project-info')

          if (!desktop) {
            gsap.set(project, { autoAlpha: 1, y: 0 })
            gsap.set(media, { autoAlpha: 1, y: 0, scale: 1, clipPath: 'none' })
            gsap.set(info, { autoAlpha: 1, x: 0 })
            return
          }

          gsap.timeline({ scrollTrigger: { trigger: project, start: 'top 80%', once: true } })
            .fromTo(project, { y: 90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out' })
            .fromTo(media, { clipPath: 'inset(0 0 100% 0)', scale: 1.08 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.15, stagger: 0.09, ease: 'power3.inOut' }, '-=0.75')
            .fromTo(info, { x: 36, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9 }, '-=0.75')

          gsap.fromTo(media, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: 1.4 } })
        })

        gsap.from('.strength-grid article', {
          y: 80, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.strength-grid', start: 'top 82%', once: true },
        })

        gsap.from('.contact-row a, .mail-big, .footer-meta > *', {
          y: 34, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.footer', start: 'top 65%', once: true },
        })
      })
    }, root)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh, { once: true })
    return () => {
      window.removeEventListener('load', refresh)
      mm.revert()
      ctx.revert()
    }
  }, [])

  return <main ref={root}>
    <nav className="nav shell site-nav">
      <a className="brand" href="#home">JIN / 2026</a>
      <div className="nav-links">
        <a href="#project-01"><i>01</i> AI 模特主图</a>
        <a href="#project-02"><i>02</i> 鞋履场景创意</a>
        <a href="#project-03"><i>03</i> 买家秀与动态内容</a>
      </div>
      <a className="contact-link" href="mailto:2813834181@qq.com" aria-label="联系我"><ArrowUpRight size={18}/></a>
    </nav>
    <section className="hero" id="home">
      <video className="hero-video" autoPlay muted loop playsInline preload="none" poster={asset('/media/hero-poster.webp')}>
        {heroReady && <source src={asset('/media/hero.mp4')} type="video/mp4" />}
      </video>
      <div className="hero-shade" />
      <div className="hero-content shell">
        <div className="cover-meta"><span>坐标<br/>↘ 温州</span><span>SLOGAN /<br/>让想象成为可见的现实</span></div>
        <p className="eyebrow"><span/> AI VISUAL DESIGN · E-COMMERCE · MOTION</p>
        <h1>作品集</h1>
        <p className="cover-sub">AI 视觉设计 / 电商视觉设计<br/><small>AI visual design / E-commerce design</small></p>
        <div className="cover-word">PORTFOLIO</div>
      <div className="hero-bottom">
          <p>Coordinate / Wenzhou</p><p>Photoshop　Illustrator　AI Tools　Video</p>
          <a href="#about" className="scroll" aria-label="向下浏览"><ArrowDown/></a>
        </div>
      </div>
    </section>

    <section className="about section shell" id="about">
      <div className="corner-note">2025 /<br/>作品集</div><div className="doodle doodle-cloud">☁<i>· · ·</i></div>
      <div className="section-index">01 / ABOUT ME</div>
      <div className="about-grid">
        <div className="bio">
          <p className="kicker">金欢欢 <span>Jin Huanhuan</span></p>
          <p className="bio-meta">女 · 视觉传达设计本科 · 黄山学院</p>
          <h2>AI视觉设计<br/>电商视觉设计</h2>
          <p className="intro">视觉传达设计本科背景，现专注于鞋服电商视觉内容。擅长将 AI 工具融入真实商业需求，完成模特场景、商品主图、鞋履场景与电商内容设计。审美执行力强，工作细致，适应能力好。</p>
          <div className="contact-row">
            <a href="tel:15888746623"><Phone size={17}/> 158 8874 6623</a>
            <a href="mailto:2813834181@qq.com"><Mail size={17}/> 2813834181@qq.com</a>
          </div>
        </div>
      </div>
      <div className="stats">
        <div><strong>02<sup>+</sup></strong><span>段商业工作经历</span><small>鞋服电商视觉 / 短视频内容</small></div>
        <div><strong>04<sup>+</sup></strong><span>核心视觉能力</span><small>AI生成 / 电商设计 / 视频 / 上架</small></div>
        <div><strong>01</strong><span>年度最佳新人奖</span><small>2025 · 温州赫德鞋服有限公司</small></div>
        <div><strong>03<sup>+</sup></strong><span>类 AI 视觉内容</span><small>AI模特 / 商品场景 / 展示视频</small></div>
        <div className="experience"><span>工作经历 · 01</span><b>温州赫德鞋服有限公司</b><small>AI视觉设计 / 电商内容设计 · 2025.09—2026.08</small><p>使用 AI 生成模特图、穿搭场景、商品展示画面与鞋品视频；围绕淘宝买家秀和详情页需求，提升视觉素材产出效率，减少模特、场地、拍摄及后期沟通成本。</p><em>工作经历 · 02　黄山吉派电子商务销售有限公司 · 2024.10—2025.02</em><p>负责短视频脚本、拍摄与剪辑，完成商品平面设计、图片处理及淘宝 / 京东 / 抖音商品上架维护。</p></div>
        <div className="education"><span>教育背景</span><b>黄山学院 · 视觉传达设计</b><small>本科 · 2021.09—2025.06</small></div>
      </div>
    </section>

    <section className="work-section" id="works">
      <div className="shell section-head"><div className="corner-note light">KEEP<br/>CREATING</div><div className="section-index">02 / SELECTED WORK</div><h2>精选项目<span>。</span></h2><p>从静态画面到动态叙事，探索 AI 与商业视觉的更多可能。</p></div>
      <div className="projects shell">
        {projects.map((p, i) => <article className={`project ${p.tone}`} id={`project-${p.no}`} key={p.no}>
          <div className="project-art">
            <div className="media-grid">{p.media.map((src, index) => src.endsWith('.mp4')
              ? <video key={src} src={asset(src)} autoPlay muted loop playsInline aria-label={`${p.title}视频`} />
              : <img key={src} src={asset(src)} alt={`${p.title}作品 ${index + 1}`} loading="lazy" />)}</div>
            <div className="project-tag">CASE STUDY {p.no}</div>
          </div>
          <div className="project-info"><div><small>{p.type}</small><h3>{p.title}<span> / {p.en}</span></h3></div><button aria-label={`查看${p.title}`}><ArrowUpRight/></button></div>
        </article>)}
      </div>
    </section>

    <section className="strength-section section" id="strengths">
      <div className="shell strength-sheet"><div className="corner-note">ALWAYS<br/>CURIOUS</div><div className="doodle doodle-smile">: )</div><div className="section-index">03 / CAPABILITIES</div><div className="strength-title"><h2>视觉的感性，<br/>技术的理性。</h2><p><Sparkles size={18}/> DESIGN × AI × COMMERCE</p></div>
        <div className="strength-grid">{strengths.map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><ArrowUpRight className="card-arrow"/></article>)}</div>
      </div>
    </section>

    <footer className="footer" id="contact">
      <div className="shell footer-inner">
        <p className="eyebrow"><span/> AVAILABLE FOR OPPORTUNITIES</p>
        <h2>一起做点<br/><em>新鲜的事。</em></h2>
        <a className="mail-big" href="mailto:2813834181@qq.com">2813834181@qq.com <ArrowUpRight/></a>
        <div className="footer-meta"><span>金欢欢 · AI VISUAL DESIGNER</span><span>WENZHOU / CHINA</span><a href="#home">BACK TO TOP ↑</a></div>
      </div>
    </footer>
  </main>
}

export default App
