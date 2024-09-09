<template>
  <div>
    <!-- 검색 입력 필드 -->
    <input type="text" v-model="keyword" placeholder="카페 이름을 입력하세요" />
    <button @click="searchCafe">검색</button>

    <!-- 지도 -->
    <div id="map" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const keyword = ref(""); // 검색어
let map = null; // 전역 지도 변수
let markers = []; // 마커 배열

const latitude = ref(0);
const longitude = ref(0);

// 카페 위치 배열
const cafeLocations = ref([
  { name: "스타벅스", lat: 37.499590490909185, lng: 127.0263723554437 },
  { name: "메가커피", lat: 37.499427948430814, lng: 127.02794423197847 },
  { name: "투썸", lat: 37.498553760499505, lng: 127.02882598822454 },
  { name: "이디야", lat: 37.497625593121384, lng: 127.02935713582038 },
  { name: "설빙", lat: 37.49646391248451, lng: 127.02675574250912 },
]);

// 브라우저에서 위치를 받아 지도 생성
onMounted(() => {
  if (!("geolocation" in navigator)) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      latitude.value = pos.coords.latitude;
      longitude.value = pos.coords.longitude;

      if (window.kakao && window.kakao.maps) {
        initMap(); // 지도 초기화
      }
    },
    (err) => {
      alert(err.message);
    }
  );
});

// 지도 초기화 함수
const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(latitude.value, longitude.value),
    level: 3,
  };

  map = new kakao.maps.Map(container, options); // 전역 map 객체에 저장

  // 현재 위치에 마커 표시
  const markerPosition = new kakao.maps.LatLng(latitude.value, longitude.value);
  const marker = new kakao.maps.Marker({
    position: markerPosition,
  });
  marker.setMap(map);

  // 모든 카페 마커 추가
  displayAllCafeMarkers();
};

// 모든 카페의 마커 표시 함수
const displayAllCafeMarkers = () => {
  // 이전에 표시된 마커가 있으면 제거
  removeMarkers();

  cafeLocations.value.forEach((cafe) => {
    const cafePosition = new kakao.maps.LatLng(cafe.lat, cafe.lng);
    const cafeMarker = new kakao.maps.Marker({
      position: cafePosition,
    });

    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">${cafe.name}</div>`,
    });

    kakao.maps.event.addListener(cafeMarker, "click", function () {
      infowindow.open(map, cafeMarker);
    });

    cafeMarker.setMap(map);
    markers.push(cafeMarker); // 마커 배열에 추가
  });
};

// 검색된 카페만 마커로 표시하는 함수
const searchCafe = () => {
  const searchKeyword = keyword.value.trim().toLowerCase(); // 검색어 소문자 변환 및 공백 제거
  if (!searchKeyword) {
    alert("검색어를 입력하세요.");
    return;
  }

  // 검색어에 맞는 카페 필터링
  const filteredCafes = cafeLocations.value.filter((cafe) =>
    cafe.name.toLowerCase().includes(searchKeyword)
  );

  // 필터링된 결과가 없으면 알림
  if (filteredCafes.length === 0) {
    alert("해당 카페를 찾을 수 없습니다.");
    return;
  }

  // 이전 마커 제거
  removeMarkers();

  // 필터링된 카페에 대해 마커 생성
  filteredCafes.forEach((cafe) => {
    const cafePosition = new kakao.maps.LatLng(cafe.lat, cafe.lng);
    const cafeMarker = new kakao.maps.Marker({
      position: cafePosition,
    });

    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">${cafe.name}</div>`,
    });

    kakao.maps.event.addListener(cafeMarker, "click", function () {
      infowindow.open(map, cafeMarker);
    });

    cafeMarker.setMap(map);
    markers.push(cafeMarker); // 마커 배열에 추가
  });

  // 첫 번째 카페 위치로 지도 중심 이동
  if (filteredCafes.length > 0) {
    map.setCenter(
      new kakao.maps.LatLng(filteredCafes[0].lat, filteredCafes[0].lng)
    );
    map.setLevel(3); // 줌 레벨 조정
  }
};

// 이전 마커 제거 함수
const removeMarkers = () => {
  markers.forEach((marker) => marker.setMap(null)); // 지도에서 마커 제거
  markers = []; // 마커 배열 초기화
};
</script>

<style scoped>
input {
  width: 300px;
  padding: 5px;
  margin-right: 10px;
}
button {
  padding: 5px 10px;
}
</style>
