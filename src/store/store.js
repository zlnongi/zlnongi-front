import { createStore } from "vuex";

export default createStore({
  state: {
    userData: [
      {
        userid: "zlnongi",
        password: "123",
        username: "여진홍",
        addr: "서울",
        image: "https://picsum.photos/100",
      },
      {
        userid: "ganggang",
        password: "123",
        username: "장윤경",
        addr: "의왕",
        image: "https://picsum.photos/100",
      },
      {
        userid: "minalee",
        password: "123",
        username: "이민아",
        addr: "서울",
        image: "https://picsum.photos/100",
      },
    ],
    cafeLocations: [
      { name: "스타벅스", lat: 37.499590490909185, lng: 127.0263723554437 },
      { name: "메가커피", lat: 37.499427948430814, lng: 127.02794423197847 },
      { name: "투썸", lat: 37.498553760499505, lng: 127.02882598822454 },
      { name: "이디야", lat: 37.497625593121384, lng: 127.02935713582038 },
      { name: "설빙", lat: 37.49646391248451, lng: 127.02675574250912 },
    ],
  },
  mutations: {
    addUser(state, payload) {
      state.userData.push(payload);
    },
    // 카페 위치 추가 기능
    addCafe(state, payload) {
      state.cafeLocations.push(payload);
    },
  },
});
