export default function AboutPage() {
  return (
    <div className='post-section'>
      <div className='about'>
        <div className='about-intro'>
          <p>안녕하세요!</p>

          <p>
            견고한 마크업으로 정보와 가치를 전달합니다. 다양한 직군과 원활하게
            소통하고 협업하는 것을 중요하게 생각하며, 더 나은 방식을 끊임없이
            탐구하고 있습니다.
          </p>
        </div>
        <ul className='about-career'>
          <li className='about-career-item'>
            <p className='about-career-title'>WORK EXPERIENCE</p>
          </li>
          <li className='about-career-item'>
            <div>
              <span className='about-career-company'>프리랜서</span>
              <span className='about-career-period'>2025.01 - 2026.01</span>
            </div>
            <div className='about-career-desc'>
              <p>
                NAMOO GROUP에서 운영하는 식당·클럽·카페의 웹페이지, 인스타그램
                카드, 이벤트 포스터, 메뉴판 등 디자인 작업을 진행했습니다.
                Squarespace로 구축된 기존 웹사이트의 구조와 디자인을 개선하고
                가이드 제공했습니다.
              </p>
            </div>
          </li>
          <li className='about-career-item'>
            <div>
              <span className='about-career-company'>코나아이</span>
              <span className='about-career-period'>2024.01 - 2025.01</span>
            </div>
            <div className='about-career-desc'>
              <p>
                일관된 UI/UX 제공과 유지 보수성 향상을 위해 SCSS 기반 디자인
                시스템을 구축했습니다. GSAP 라이브러리를 활용한 인터랙션 페이지
                구현과 팀 내부 포트폴리오 및 회사 이벤트 페이지를 다수
                제작했습니다.
              </p>
            </div>
          </li>
          <li className='about-career-item'>
            <div>
              <span className='about-career-company'>에코시안</span>
              <span className='about-career-period'>2020.9 - 2023.09 </span>
            </div>
            <div className='about-career-desc'>
              <p>
                UI 디자인과 퍼블리싱을 담당했습니다. 다양한 산업군의
                클라이언트를 대상으로 프로젝트를 수행하며, HighChart·Grid 디자인
                개선으로 사용자에게 직관적인 정보를 제공했습니다. Figma를 자체
                학습해 디자인 시스템을 구축하고 개발자·기획자와 공유하며
                디자인-개발 간 커뮤니케이션 효율을 높였습니다.
              </p>
            </div>
          </li>
        </ul>
        <div className='about-resume'>
          <a
            href='https://just-mulberry-b8b.notion.site/Kim-Ye-Ji-0356b560544a4984ab9db9b99fbba0bd'
            target='_blank'
            rel='noopener noreferrer'
          >
            자기소개 더 보기
          </a>
        </div>
      </div>
    </div>
  );
}
