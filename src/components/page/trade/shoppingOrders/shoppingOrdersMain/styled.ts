import styled from "styled-components";

export const ShoppingOrdersMainStyled = styled.div`
    width: 100%;

    /* ✅ 부모 컨테이너를 테이블 크기에 맞춰 자동 조절 */
    .table-wrapper {
        overflow-x: auto; /* ✅ 가로 스크롤 활성화 */
        margin-bottom: 10px;
        width: 1170px; /* ✅ 테이블 크기에 맞춰 부모 크기를 강제 적용 */
        max-width: 100vw; /* ✅ 뷰포트보다 커지는 것 방지 */
        display: block; /* ✅ flex/grid 영향을 받지 않도록 */
    }
    table {
        width: auto; /* ✅ 테이블 크기를 컬럼 크기에 맞춤 */
        min-width: 1300px; /* ✅ 최소 너비 설정 */
        max-width: 100%; /* ✅ 화면이 작아질 때 너비 조정 가능 */
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 13px;
        table-layout: fixed; /* ✅ 컬럼 너비를 고정 */
    }

    table, th, td {
        border: 1px solid #ddd;
    }

    th, td {
        padding: 12px;
        text-align: center;
        white-space: nowrap;
    }

    th {
        background-color: #f4f4f4;
        font-weight: bold;
    }

    tr:hover {
        background-color: #f1f1f1;
    }

    .td-pointer:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    /* ✅ 컬럼 너비 정확히 1600px로 맞추기 */
    th:nth-child(1), td:nth-child(1) { width: 70px; }  /* 주문번호 */
    th:nth-child(2), td:nth-child(2) { width: 120px; } /* 주문일자 */
    th:nth-child(3), td:nth-child(3) { width: 110px; } /* 고객기업명 */
    th:nth-child(4), td:nth-child(4) { width: 160px; } /* 주문제품명 */
    th:nth-child(5), td:nth-child(5) { width: 120px; } /* 총재고개수 */
    th:nth-child(6), td:nth-child(6) { width: 120px; } /* 단가 */
    th:nth-child(7), td:nth-child(7) { width: 100px; } /* 주문개수 */
    th:nth-child(8), td:nth-child(8) { width: 80px; }  /* 금액합계 */
    th:nth-child(9), td:nth-child(9) { width: 120px; } /* 반품 요청 여부 */
    th:nth-child(10), td:nth-child(10) { width: 120px; } /* 반품 처리 일자 */
    th:nth-child(11), td:nth-child(11) { width: 100px; } /* 배송 지시서 */
    th:nth-child(12), td:nth-child(12) { width: 100px; } /* 발주 지시서 */
`;
