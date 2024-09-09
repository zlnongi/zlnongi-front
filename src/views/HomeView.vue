<template>
  <div>
    <!-- 검색 입력 필드 -->
    <input v-model="keyword" type="text" placeholder="카페 이름을 입력하세요" />
    <button @click="searchCafe">검색</button>

    <!-- 지도 -->
    <div id="map" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

let map = null; // 지도 객체
let markers = []; // 마커 배열
const keyword = ref(""); // 검색어

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      initMap(latitude, longitude); // 사용자 위치 기준으로 지도 초기화
    });
  }
});

// 지도 초기화 함수
const initMap = (latitude, longitude) => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(latitude, longitude),
    level: 3,
  };

  map = new kakao.maps.Map(container, options); // 지도 객체 생성

  displayCafeMarkers(); // 호출 !! 모든 카페 위치에 마커를 표시
};

// 모든 카페의 마커 표시 함수
const displayCafeMarkers = () => {
  const cafeLocations = store.state.cafeLocations; // Vuex에서 카페 위치 가져오기

  cafeLocations.forEach((cafe) => {
    const cafePosition = new kakao.maps.LatLng(cafe.lat, cafe.lng);
    const marker = new kakao.maps.Marker({
      position: cafePosition,
      map: map,
    });

    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">${cafe.name}</div>`,
    });

    kakao.maps.event.addListener(marker, "click", function () {
      infowindow.open(map, marker);
    });

    markers.push(marker); // 마커 배열에 추가
  });
};

// 검색된 카페만 마커로 표시하는 함수
const searchCafe = () => {
  const searchKeyword = keyword.value.trim().toLowerCase(); // 검색어 소문자로 변환 및 공백 제거

  if (!searchKeyword) {
    alert("검색어를 입력하세요.");
    return;
  }

  // 검색어에 맞는 카페 필터링
  const filteredCafes = store.state.cafeLocations.filter((cafe) =>
    cafe.name.toLowerCase().includes(searchKeyword)
  );

  // 필터링된 결과가 없으면 알림
  if (filteredCafes.length === 0) {
    alert("해당 카페를 찾을 수 없습니다.");
    return;
  }

  // 이전 마커 제거
  removeMarkers();

  // 필터링된 카페들에 대해 마커 생성
  filteredCafes.forEach((cafe) => {
    const cafePosition = new kakao.maps.LatLng(cafe.lat, cafe.lng);
    const marker = new kakao.maps.Marker({
      position: cafePosition,
      map: map,
    });

    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">${cafe.name}</div>`,
    });

    kakao.maps.event.addListener(marker, "click", function () {
      infowindow.open(map, marker);
    });

    markers.push(marker); // 마커 배열에 추가
  });

  // 첫 번째 검색된 카페 위치로 지도 중심 이동
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
#map {
  width: 100%;
  height: 400px;
}

input {
  padding: 5px;
  margin-right: 10px;
  width: 300px;
}

button {
  padding: 5px 10px;
}
</style>
