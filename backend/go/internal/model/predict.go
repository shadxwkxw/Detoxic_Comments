package model

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func PredictText(text string) (string, error) {
	requestBody, err := json.Marshal(map[string]string{
		"text": text,
	})
	if err != nil {
		return "", err
	}

	resp, err := http.Post("http://localhost:5000/detox", "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var responseData map[string]string
	if err := json.Unmarshal(body, &responseData); err != nil {
		return "", err
	}

	return responseData["detoxed_text"], nil
}
