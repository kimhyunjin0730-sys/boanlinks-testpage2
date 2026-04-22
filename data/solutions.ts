import type { Solution } from '@/types';

export const SOLUTIONS: Solution[] = [
  {
    id: 'boanlinks',
    title: '보안마켓플레이스',
    eng: 'Boanlinks',
    sub: '중소기업을 위한 구독형 보안 진단 서비스',
    color: '#2563eb',
    icon: null,
    img1: '',
    img2: '',
    overview:
      'Boanlinks는 기업의 보안 점검부터 보안 제품 매칭까지 원스톱으로 제공합니다. 웹사이트·웹어플리케이션·시스템·네트워크의 취약점을 종합 점검하고 기업 환경에 맞는 최적 보안 제품을 매칭해 드립니다.',
    features: [
      '웹사이트 악성코드를 최신 점검 코드 기반으로 점검',
      '웹 애플리케이션 취약점을 OWASP TOP 10 기반으로 점검',
      '시스템(PC) 취약점을 주요 정보통신기반시설 가이드로 점검',
      '유무선 네트워크 취약점 종합 점검',
      '기업 환경에 맞는 보안 제품 매칭',
    ],
    brochure: {
      tagline: '중소기업 보안의 새로운 패러다임',
      summary:
        '보안링스는 보안 인프라가 부족한 중소기업을 위해 설계된 구독형 보안진단 플랫폼입니다. 보안 예산과 전문인력이 부족한 기업에게 자동화된 보안진단, AI 기반 솔루션 추천, 전문가 연결, 사이버 보험까지 통합 제공합니다.',
      pdfUrl: '/docs/boanlinks-intro.pdf',
      slideImages: [
        '/boanlinks-intro-slides/image1.jpg',
        '/boanlinks-intro-slides/image2.jpg',
        '/boanlinks-intro-slides/image3.jpg',
        '/boanlinks-intro-slides/image4.jpg',
        '/boanlinks-intro-slides/image5.jpg',
        '/boanlinks-intro-slides/image6.jpg',
        '/boanlinks-intro-slides/image7.jpg',
        '/boanlinks-intro-slides/image8.jpg',
        '/boanlinks-intro-slides/image9.jpg',
        '/boanlinks-intro-slides/image10.jpg',
        '/boanlinks-intro-slides/image11.jpg',
        '/boanlinks-intro-slides/image12.jpg',
      ],
      stats: [
        { value: '93%', label: '중소기업 사고 비율', caption: '전체 보안 사고 중 중소기업이 차지하는 비율' },
        { value: '194일', label: '평균 탐지 지연', caption: '기존 방식의 위협 탐지 소요 시간' },
        { value: '55개', label: '진단 항목', caption: '웹·시스템·네트워크 통합 진단' },
        { value: '20~30%', label: '비용 절감', caption: '해외 솔루션 대비 국산 연동 솔루션' },
      ],
      customerSegments: [
        {
          type: '스타트업 · 중소기업',
          need: '보안 예산이 부족하나 최소한의 보호 필요',
          solution: '보안링스 진단 + 기본 보안제품 매칭 + 정기 운영 전문가 매칭',
        },
        {
          type: '제조사 · 중견기업',
          need: '네트워크·OT 환경 등 복합적 보안 요구',
          solution: '진단 + 네트워크 솔루션 매칭 + OTID·ESE 병행 구축',
        },
        {
          type: '금융 · 공공기관',
          need: '높은 보안 수준 요구, 문서·데이터 보호 필수',
          solution: 'D-GO 기반 중요 데이터 보호 + ESE 기반 통합 관리',
        },
        {
          type: '법률 · 세무 · 회계 · 노무 분야',
          need: '보안 상태 및 수준 진단, 취약점 점검',
          solution: '기본 보안제품 매칭 + 필요 시 전문가 매칭 보안 구조',
        },
      ],
      threats: [
        {
          title: '서버 해킹 급증',
          description: '2025년 상반기 침해사고의 51.4%가 서버 해킹. 보안 대책이 미흡한 중소기업 시스템이 주요 표적',
        },
        {
          title: 'DNS Query Flooding 공격',
          description: 'DDoS 공격 중 71%가 DNS 서버 과부하 공격. 전년 대비 55.5% 증가하며 정보통신업 집중 타깃',
        },
        {
          title: 'AI 기반 공격 진화',
          description: '생성형 AI를 활용한 정교한 피싱과 악성코드 제작. 기존 보안 솔루션으로는 탐지 어려움',
        },
        {
          title: '북한 라자루스 공격',
          description: '랜섬웨어 등 실존 위협이 한국 기업을 타깃으로 정밀공격 중',
        },
        {
          title: '전문가 부재',
          description: 'SIEM 단일 제품만으로는 역부족. 전문가·통합관제 서비스 필수',
        },
        {
          title: 'AI 대응 역량 부족',
          description: '한국 기업의 91.7%가 AI 공격 대응에 \'전혀 자신 없음\' 응답',
        },
      ],
      values: [
        {
          title: '비용 절감',
          description:
            '자동화된 보안 진단으로 전담 인력 없이도 대기업 수준의 보안 체계 구축. 월 몇 만원으로 최대 수십억 원 리스크 방어 가능',
        },
        {
          title: '사고 예방',
          description:
            '사전 취약점 점검을 통한 보안 사고 예방 및 보안 체계 확충. 평균 탐지 지연 시간 194일을 즉시 대응으로 단축',
        },
        {
          title: '운영 효율성',
          description:
            'AI 기반 솔루션 추천으로 보안 운영 효율성 향상. 기업 환경에 맞는 맞춤형 제품 자동 추천',
        },
        {
          title: '리스크 최소화',
          description:
            '전문가 연결 및 사이버 보험으로 리스크 최소화. 사고 발생 시 골든 타임 즉각 대응 및 경제적 손해 보상',
        },
      ],
      featureDetails: [
        {
          step: '01',
          title: '보안 진단',
          description:
            '웹사이트 악성코드 탐지, 시스템/네트워크 취약점 점검, 무선 네트워크 보안 점검 등 총 55개 항목 진단',
        },
        {
          step: '02',
          title: 'AI 솔루션 추천',
          description: '기업 규모 및 진단 결과 기반 보안 제품 자동 추천. 필요한 기능만 선택해 비용 최소화',
        },
        {
          step: '03',
          title: '보안 제품 연계',
          description:
            'V3, ASM, RTCrypto 등 다양한 보안제품과 연동. KISA C-TAS API, ZAP, Nessus, Acunetix 통합',
        },
        {
          step: '04',
          title: '전문가 연결',
          description: '프리미엄 요금제에서 보안전문가 월 1회 방문 컨설팅 제공. 현장 맞춤형 보안 전략 수립',
        },
        {
          step: '05',
          title: '사이버 보험',
          description: '해킹·정보유출 등 사고대비 보험 상품 안내 및 연계. 경제적 손해 보상 지원',
        },
      ],
      techHighlights: [
        {
          title: '자동화 진단',
          description: 'OWASP Top 10 기반 웹 취약점 자동 스캔, 시스템 패치 여부 확인',
        },
        {
          title: '보안 도구 연동',
          description: 'XDR/SOAR 연계로 단말-서버-클라우드 전반 자산 실시간 분석',
        },
        {
          title: '실시간 리포트',
          description: 'PDF/Excel 형식의 진단 결과 보고서 자동 생성. 위험도 분류 및 제품 추천 포함',
        },
        {
          title: '사용자 친화적 UI',
          description: '모바일 대응형 웹 기반 인터페이스, 직관적인 진단 요청 및 결과 확인',
        },
      ],
      pricingTiers: [
        {
          name: '프리',
          price: '무료',
          features: ['월 1회 진단', '기본 보고서 제공', 'AI 제품 추천'],
        },
        {
          name: '베이직',
          price: '월 5만원',
          features: ['월 1회 진단', '기본/상세 보고서 제공', 'AI 제품 추천', '고객 지원'],
        },
        {
          name: '스탠다드',
          price: '월 15만원',
          highlight: true,
          features: [
            '주 1회 진단',
            '기본/상세 보고서 제공',
            'AI 제품 추천',
            '고객 지원',
            '실시간 모니터링',
          ],
        },
        {
          name: '프리미엄',
          price: '월 50만원',
          features: [
            '주 1회 진단',
            '기본/상세 보고서 제공',
            'AI 제품 추천',
            '월 1회 전문가 방문',
            '사이버 보험 연계',
          ],
        },
      ],
      marketTrends: [
        {
          source: '한국IDC (2025.04)',
          metric: '14.1%',
          label: '보안 지출 성장률',
          caption: '향후 2년간 중소기업 보안 투자 증가율',
        },
        {
          source: 'Mordor Intelligence',
          metric: '91.7%',
          label: '대응 역량 부족',
          caption: 'AI 기반 공격에 자신 없다고 응답한 기업 비율',
        },
        {
          source: 'ComputerWorld',
          metric: '20~30%',
          label: '비용 절감',
          caption: '해외 솔루션 대비 국산 연동 솔루션 비용 절감률',
        },
      ],
      closingMessage:
        '월 몇만 원으로 수십억 원 손실 예방 가능. SIEM/XDR/SOAR 통합 운영 + 레포트 자동 생성으로 최소 인력으로도 대기업 수준 보안 구현. 국내 최초 구독형 보안 진단 + 제품 추천 + 보험 연계 통합 제공 플랫폼.',
    },
  },
  {
    id: 'dgo',
    title: '양자데이터금고시스템',
    eng: 'D-GO',
    sub: '디지털 공증 금고 · 데이터 원본 보호 플랫폼',
    color: '#3b5bdb',
    icon: null,
    img1: '',
    img2: '',
    overview:
      'D-GO는 단순한 클라우드가 아닙니다. 복제 방지·무결성 보장·생성자 인증·원본대조필 인증을 통해 디지털 데이터를 법적 원본과 동일한 효력으로 관리하는 물리격리 기반 디지털 공증 금고입니다.',
    features: [
      '사진·동영상·스캔본·음성 데이터 무결성 보장',
      'SHA-256 해시·디지털 서명으로 원본 자동 공증',
      '3단계 공증 구조: 무결성·생성자·저장소 봉인',
      '원본대조필 인증서 자동 발급 (QR 검증 포함)',
      '5단계 권한 관리 구조 (열람→소유권이전)',
    ],
  },
  {
    id: 'ese',
    title: '전사적 보안사고 예측평가시스템',
    eng: 'ESE',
    sub: '전사적 보안사고 예측평가 시스템',
    color: '#0891b2',
    icon: null,
    img1: '',
    img2: '',
    overview:
      "ESE는 전사적 보안 위협을 사전에 '예측'하고 그 '영향도'를 정량적으로 평가하는 시스템입니다. 방화벽이나 백신이 아닌, 기업의 '보안 건강 지수'를 진단하고 처방합니다.",
    features: [
      '보안 위협 사전 예측 및 정량적 영향도 평가',
      "기업 '보안 건강 지수' 진단 및 처방",
      '보고서 기반 객관적 보안 의사결정 지원',
      '지능형 보안사고 프로파일링',
      '능동적 방어 체계 구축 지원',
    ],
  },
  {
    id: 'secuwifi',
    title: '보안무선공유시스템',
    eng: 'SECU WI-FI',
    sub: '동적 인증 기술 기반 Wi-Fi 보안·마케팅 솔루션',
    color: '#7c3aed',
    icon: null,
    img1: '',
    img2: '',
    overview:
      'SECU WI-FI는 동적 인증 기술 기반의 Wi-Fi 보안 및 마케팅 솔루션입니다. 강력한 보안과 동적 인증을 수행하며 접속 이력 분석 및 마케팅 채널로 활용할 수 있습니다.',
    features: [
      '강력한 보안 및 동적 인증 수행',
      '접속 이력 분석 및 통계 관리',
      '마케팅·홍보 채널 활용',
      '사용자 편의성 및 타 기기 연결 지원',
    ],
  },
  {
    id: 'secumom',
    title: '보안리스크관리시스템',
    eng: 'SECUMOM',
    sub: '하나면 충분한 보안리스크 관리 플랫폼',
    color: '#059669',
    icon: null,
    img1: '',
    img2: '',
    overview:
      'SECUMOM은 (주)진앤현시큐리티가 24년 보안 운영 노하우를 집약해 개발한 보안리스크 통합 관리 플랫폼입니다. ISMS-P 컴플라이언스 관리부터 취약점 통합 관리·보안성 심의·개인정보보호 관리·보안 정책 결재까지, 기업 보안 리스크를 하나의 플랫폼에서 원스톱으로 처리합니다. GS인증(소프트웨어 품질인증) 1등급을 획득하였으며, 금융·공공·일반기업 280개 이상의 고객사가 도입한 검증된 솔루션입니다.',
    features: [
      'ISMS-P·ISO27001 등 컴플라이언스 항목 점검 및 증적 파일 통합 관리',
      '인프라·웹·소스코드 취약점 점검 및 실시간 조치 현황 대시보드',
      '보안성 심의: 단계별 가이드로 보안 위험 사전 검토·승인 자동화',
      '개인정보 라이프사이클 관리 및 위·수탁 업체 감독·이행점검',
      '보안 정책 신청·결재 프로세스 일원화 및 워크플로우 자동화',
      'GS인증 1등급 · ISO 9001/14001/45001 인증 획득 솔루션',
    ],
  },
];
